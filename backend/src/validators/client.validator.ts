import { z } from 'zod';

export const getClientsSchema = z.object({
  search: z.string().optional(),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
});

export const getRecentClientsSchema = z.object({});

export type GetClientsInput = z.infer<typeof getClientsSchema>;
export type GetRecentClientsInput = z.infer<typeof getRecentClientsSchema>;
