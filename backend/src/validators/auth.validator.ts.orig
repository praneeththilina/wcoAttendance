import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().optional().default(false),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    employeeId: z.string().min(1, 'Employee ID is required'),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RegisterInput = z.infer<typeof registerSchema>['body'];
