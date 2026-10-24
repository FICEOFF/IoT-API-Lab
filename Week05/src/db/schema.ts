import { pgTable, pgEnum, varchar, char, date } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["male", "female"]);

export const students = pgTable("students", {
    studentId: char("student_id", { length: 8 }).primaryKey(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    dateOfBirth: date("date_of_birth", { mode: "string" }).notNull(),
    gender: genderEnum("gender").notNull()
});

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
