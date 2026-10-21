import { date, pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core'

export const genderEnum = pgEnum('gender', ['male', 'female'])

export const students = pgTable('students', {
    studentId: varchar('student_id', { length: 8 }).primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    birthDate: date('birth_date', { mode: 'string' }).notNull(),
    gender: genderEnum('gender').notNull()
})
