import { z } from 'zod';

export const checkInSchema = z.object({
  body: z.object({
    clientId: z.string().min(1, 'Client ID is required'),
    location: z
      .object({
        latitude: z.number(),
        longitude: z.number(),
      })
      .optional(),
  }),
});

export const checkOutSchema = z.object({
  body: z.object({
    location: z
      .object({
        latitude: z.number(),
        longitude: z.number(),
      })
      .optional(),
  }),
});

export const getTodaySchema = z.object({
  query: z.object({
    userId: z.string().optional(),
  }),
});

export const getHistorySchema = z.object({
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('20'),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export type CheckInInput = z.infer<typeof checkInSchema>['body'];
export type CheckOutInput = z.infer<typeof checkOutSchema>['body'];
export type GetTodayInput = z.infer<typeof getTodaySchema>['query'];
export type GetHistoryInput = z.infer<typeof getHistorySchema>['query'];
