import { z } from 'zod';

export const createStaffSchema = z.object({
  body: z.object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    role: z.enum(['employee', 'admin', 'manager', 'hr']).default('employee'),
    isActive: z.boolean().default(true),
  }),
});

export const updateStaffSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format').optional(),
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    role: z.enum(['employee', 'admin', 'manager', 'hr']).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getDailyReportSchema = z.object({
  query: z.object({
    date: z.string().min(1, 'Date is required'),
  }),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>['body'];
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>['body'];
export type GetDailyReportInput = z.infer<typeof getDailyReportSchema>['query'];
