import { z } from 'zod';

// Auth related schemas
export const loginSchema = z.object({
  email: z.string({ message: "Email must be string" }).email('Email is not valid').toLowerCase(),
  password: z.string({ message: "Password must be string" }).min(1, 'Password is required')
});

export const createUserSchema = z.object({
  username: z.string({ message: "Username must be string" })
    .trim()
    .min(3, 'Username required at least 3 characters')
    .max(20, 'Username must not contain more than 20 characters')
    .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase, underscores and numbers'),
  fullName: z.string({ message: "Full name must be string" })
    .trim()
    .min(3, 'Full name required at least 3 characters')
    .max(50, 'Full name can only have 50 characters')
    .regex(/^[A-Za-z\s]+$/, 'Full name can only have spaces and alphabets'),
  email: z.string({ message: "Email must be string" })
    .trim()
    .min(3, 'Email required at least 3 characters')
    .max(100, 'Email can only have 100 characters')
    .regex(/^(?=.{1,64}@)[a-z0-9_-]+(\.[a-z0-9_-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/, { message: "Email is not valid" }),
  password: z.string({ message: "Password must be string" })
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password can only have 100 characters'),
  role: z.enum(['ADMIN', 'USER']).optional()
});

// Email campaign schemas
export const emailBatchSchema = z.object({
  batchName: z.string({ message: "Batch name is required" })
    .min(3, "Batch name must be at least 3 characters")
    .max(50, "Batch name must be less than 50 characters"),
  subject: z.string({ message: "Subject is required" })
    .min(3, "Subject must be at least 3 characters")
    .max(50, "Subject must be less than 50 characters"),
  delayBetweenEmails: z.string({ message: "Delay between emails is required" }),
  emailsPerBatch: z.string({ message: "Emails per batch is required" })
    .min(1, "Emails per batch must be at least 1")
    .max(100, "Emails per batch must be less than 100"),
  scheduleTime: z.string({ message: "Schedule time is required" })
    .min(3, "Schedule time must be at least 3 characters")
    .max(50, "Schedule time must be less than 50 characters"),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  composedEmail: z.string().optional() // Optional in form, validated manually
});

// Type exports for convenience
export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type EmailBatchFormData = z.infer<typeof emailBatchSchema>;