import { z } from 'zod'

export const createStudentSchema = z.object({
    studentId: z.string().min(1).max(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    birthDate: z.iso.date(),
    gender: z.enum(['male', 'female']),
})

export const updateStudentSchema = createStudentSchema.omit({ studentId: true }).partial()
