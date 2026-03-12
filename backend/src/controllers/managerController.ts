import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const managerController = {
  getDashboardStats: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get today's attendance records with user and client details
      const todaysAttendance = await prisma.attendanceRecord.findMany({
        where: {
          checkInTime: {
            gte: today,
          }
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              employeeId: true
            }
          },
          client: {
            select: {
              name: true,
              city: true
            }
          }
        },
        orderBy: {
          checkInTime: 'desc'
        }
      });

      res.status(200).json({
        success: true,
        data: {
          todaysAttendance,
          totalPresent: todaysAttendance.length
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
