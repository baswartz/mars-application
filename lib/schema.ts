import { z } from 'zod'

export const FormDataSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  dob: z.date(),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  nationality: z.string().min(1, 'Nationality is required'),
  departure: z.date(),
  return: z.date().refine(data => data > new Date(), "Return must be after departure"),
  accommodation: z.enum(['space-hotel', 'martian-base']),
  requests: z.string().optional(),
  declaration: z.boolean(),
  emergencyContact: z.string().min(10),
  medicalConditions: z.string().optional()
})