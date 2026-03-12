import { z } from 'zod';

export const createLeaveRequestSchema = z.object({
  body: z.object({
    type: z.enum(['sick', 'annual', 'unpaid', 'other'], {
      required_error: 'Leave type is required',
    }),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    reason: z.string().optional(),
    days: z.number().positive('Days must be a positive number'),
  }),
});

export const updateLeaveStatusSchema = z.object({
  body: z.object({
    status: z.enum(['approved', 'rejected'], {
      required_error: 'Status is required to update a leave request',
    }),
  }),
});

export const getLeaveRequestsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('20'),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
  }),
});

export const updateLeaveBalanceSchema = z.object({
  body: z.object({
    year: z.number().int().positive(),
    sickLeaveTotal: z.number().int().min(0).optional(),
    annualLeaveTotal: z.number().int().min(0).optional(),
  }),
});
