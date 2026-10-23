import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from './db/index'
import { authMiddleware } from './middleware/auth'
import { students } from './db/schema'
import { zValidator } from '@hono/zod-validator'
import { createStudentSchema, updateStudentSchema } from './schemas/students'

const app = new Hono()

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.use('/api/*', authMiddleware)

app.post('/api/v1/students', zValidator('json', createStudentSchema), async (c) => {
    const [created] = await db
        .insert(students)
        .values(c.req.valid('json'))
        .onConflictDoNothing()
        .returning()
    if (!created) {
        return c.json({ error: 'Student already exists' }, 409)
    }
    return c.json(created, 201)
})

app.get('/api/v1/students', async (c) => {
    return c.json(await db.select().from(students))
})

app.get('/api/v1/students/:id', async (c) => {
    const [student] = await db
        .select()
        .from(students)
        .where(eq(students.studentId, c.req.param('id')))
    if (!student) {
        return c.json({ error: 'Student not found' }, 404)
    }
    return c.json(student)
})

app.put('/api/v1/students/:id', zValidator('json', updateStudentSchema), async (c) => {
    const [updated] = await db
        .update(students)
        .set(c.req.valid('json'))
        .where(eq(students.studentId, c.req.param('id')))
        .returning()
    if (!updated) {
        return c.json({ error: 'Student not found' }, 404)
    }
    return c.json(updated)
})

app.delete('/api/v1/students/:id', async (c) => {
    const [deleted] = await db
        .delete(students)
        .where(eq(students.studentId, c.req.param('id')))
        .returning()
    if (!deleted) {
        return c.json({ error: 'Student not found' }, 404)
    }
    return c.json(deleted)
})

export default app
