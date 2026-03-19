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

const clientBaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  branch: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isActive: z.boolean().default(true)
});

export const createClientSchema = z.object({
  body: clientBaseSchema
});

export const updateClientSchema = z.object({
  body: clientBaseSchema.partial()
});

export const updateSettingsSchema = z.object({
  body: z.object({
    checkInDeadlineHour: z.number().int().min(0).max(23).optional(),
    checkInDeadlineMinute: z.number().int().min(0).max(59).optional(),
    maxDistanceMeters: z.number().int().positive().optional(),
    autoLocationCaptureHour: z.number().int().min(0).max(23).optional(),
    autoLocationCaptureMinute: z.number().int().min(0).max(59).optional(),
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
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>['body'];
