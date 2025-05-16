import { z } from 'zod'

export const FormDataSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  dob: z.date(),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  nationality: z.string().min(1, 'Nationality is required'),
  dateRange: z.object({
    from: z.string().date(), // expects 'YYYY-MM-DD'
    to: z.string().date(),
  }, { required_error: "Please select a date range" }),
  accommodation: z.enum(['space-hotel', 'martian-base'], {
    required_error: 'Please select your accommodation preference.'
  }),
  requests: z.string().optional(),
  declaration: z.boolean(),
  emergencyContact: z.string().min(10, 'Emergency contact number must be at least 10 digits').regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  medicalConditions: z.string().optional()
}).refine(
    data => data.dateRange.from < data.dateRange.to,
    {
      path: ['dateRange'],
      message: 'Departure date must be before return date',
    }
  )