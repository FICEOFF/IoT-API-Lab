import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { students } from "../db/schema";

const studentSchema = z.object({
    studentId: z.string().length(8),
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    dateOfBirth: z.iso.date(),
    gender: z.enum(["male", "female"]),
});

const updateSchema = studentSchema.partial();
const idParam = z.object({ studentId: z.string().length(8) });
const isUniqueViolation = (err: any) => err?.code === "23505" || err?.cause?.code === "23505";

const app = new Hono();

app.get("/", async (c) => {
    const data = await db
        .select()
        .from(students)
        .orderBy(students.studentId);
    return c.json(data);
});

app.get("/:studentId", zValidator("param", idParam), async (c) => {
    const { studentId } = c.req.valid("param");
    const [student] = await db
        .select()
        .from(students)
        .where(eq(students.studentId, studentId));
    if (!student) {
        return c.json({ error: "Student not found" }, 404);
    }
    return c.json(student);
});

app.post("/", zValidator("json", studentSchema), async (c) => {
    const body = c.req.valid("json");
    try {
        const [created] = await db
            .insert(students)
            .values(body)
            .returning();
        return c.json(created, 201);
    }
    catch (err) {
        if (isUniqueViolation(err)) {
            return c.json({ error: "studentId already exists" }, 409);
        }
        throw err;
    }
});

app.put("/:studentId", zValidator("param", idParam), zValidator("json", updateSchema), async (c) => {
    const { studentId } = c.req.valid("param");
    const body = c.req.valid("json");
    if (Object.keys(body).length === 0) {
        return c.json({ error: "No fields to update" }, 400);
    }
    try {
        const [updated] = await db
            .update(students)
            .set(body)
            .where(eq(students.studentId, studentId))
            .returning();
        if (!updated) {
            return c.json({ error: "Student not found" }, 404);
        }
        return c.json(updated);
    }
    catch (err) {
        if (isUniqueViolation(err)) {
            return c.json({ error: "studentId already exists" }, 409);
        }
        throw err;
    }
});

app.delete("/:studentId", zValidator("param", idParam), async (c) => {
    const { studentId } = c.req.valid("param");
    const [deleted] = await db
        .delete(students)
        .where(eq(students.studentId, studentId))
        .returning();
    if (!deleted) {
        return c.json({ error: "Student not found" }, 404);
    }
    return c.json({ message: "Student deleted", student: deleted });
});

export default app;
