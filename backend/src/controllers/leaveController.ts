import type { Request, Response, NextFunction } from 'express';
import * as leaveService from '../services/leaveService.js';
import { 
  createLeaveRequestSchema, 
  updateLeaveStatusSchema, 
  getLeaveRequestsSchema, 
  updateLeaveBalanceSchema 
} from '../validators/leave.validator.js';
import type { AuthRequest } from '../middleware/auth.js';

export async function getMyBalance(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user!.userId;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const balance = await leaveService.getLeaveBalance(userId, year);

    res.status(200).json({
      success: true,
      data: balance,
    });
  } catch (error) {
    next(error);
  }
}

export async function createLeaveRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = createLeaveRequestSchema.shape.body.parse(req.body);
    const userId = (req as AuthRequest).user!.userId;
    
    // Pass everything explicitly but only allowed leave types based on the union type
    const result = await leaveService.createLeaveRequest(userId, {
      type: validated.type as 'sick' | 'annual' | 'unpaid' | 'other',
      startDate: validated.startDate,
      endDate: validated.endDate,
      reason: validated.reason,
      days: validated.days,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyLeaveRequests(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user!.userId;
    const validated = getLeaveRequestsSchema.shape.query.parse(req.query);
    
    const result = await leaveService.getLeaveRequests({
      userId,
      ...validated,
      status: validated.status as 'pending' | 'approved' | 'rejected' | undefined,
      page: parseInt(validated.page as string),
      limit: parseInt(validated.limit as string),
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

// Admin/HR endpoints

export async function getAllLeaveRequests(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = getLeaveRequestsSchema.shape.query.parse(req.query);
    
    const result = await leaveService.getLeaveRequests({
      ...validated,
      status: validated.status as 'pending' | 'approved' | 'rejected' | undefined,
      page: parseInt(validated.page as string),
      limit: parseInt(validated.limit as string),
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

export async function updateLeaveRequestStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const validated = updateLeaveStatusSchema.shape.body.parse(req.body);
    const reviewerId = (req as AuthRequest).user!.userId;

    const result = await leaveService.updateLeaveRequestStatus(
      id,
      validated.status as 'approved' | 'rejected',
      reviewerId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLeaveBalance(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const validated = updateLeaveBalanceSchema.shape.body.parse(req.body);

    const result = await leaveService.setLeaveBalance(
      userId,
      validated.year,
      validated.sickLeaveTotal,
      validated.annualLeaveTotal
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
