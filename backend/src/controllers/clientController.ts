import type { Request, Response, NextFunction } from 'express';
import * as clientService from '../services/clientService.js';
import { getClientsSchema } from '../validators/client.validator.js';
import type { AuthRequest } from '../middleware/auth.js';

export async function getClients(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = getClientsSchema.parse(req.query);
    const userId = (req as AuthRequest).user!.userId;
    const result = await clientService.getClients(userId, validated);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecentClients(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user!.userId;
    const result = await clientService.getRecentClients(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function searchClients(req: Request, res: Response, next: NextFunction) {
  try {
    const { q } = req.query;
    const userId = (req as AuthRequest).user!.userId;
    const result = await clientService.searchClients(userId, q as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
