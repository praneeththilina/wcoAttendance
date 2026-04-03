import type { Request, Response, NextFunction } from 'express';
import * as attendanceService from '../services/attendanceService.js';
import {
  checkInSchema,
  checkOutSchema,
  getHistorySchema,
  changeLocationSchema,
} from '../validators/attendance.validator.js';
import type { AuthRequest } from '../middleware/auth.js';

export async function checkIn(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = checkInSchema.shape.body.parse(req.body);
    const userId = (req as AuthRequest).user!.userId;
    const result = await attendanceService.checkIn(userId, validated);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function checkOut(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = checkOutSchema.shape.body.parse(req.body);
    const userId = (req as AuthRequest).user!.userId;
    const result = await attendanceService.checkOut(userId, validated);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getToday(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user!.userId;
    const result = await attendanceService.getTodayStatus(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = getHistorySchema.shape.query.parse(req.query);
    const userId = (req as AuthRequest).user!.userId;
    const result = await attendanceService.getHistory(userId, {
      page: parseInt(validated.page as string),
      limit: parseInt(validated.limit as string),
      startDate: validated.startDate,
      endDate: validated.endDate,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function changeLocation(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = changeLocationSchema.shape.body.parse(req.body);
    const { clientId, location } = validated;
    const userId = (req as AuthRequest).user!.userId;
    const result = await attendanceService.changeLocation(
      userId,
      clientId,
      location && location.latitude !== undefined && location.longitude !== undefined
        ? { latitude: location.latitude, longitude: location.longitude }
        : undefined
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
