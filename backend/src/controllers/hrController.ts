import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const hrController = {
  getDashboardStats: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Basic stats for HR Dashboard
      // ⚡ Bolt: Fetch totalEmployees and todaysAttendance concurrently to reduce response time
      const [totalEmployees, todaysAttendance] = await Promise.all([
        prisma.user.count({
          where: { role: 'employee', isActive: true },
        }),
        prisma.attendanceRecord.findMany({
          where: {
            checkInTime: {
              gte: today,
            },
          },
          include: {
            user: {
              select: { firstName: true, lastName: true, employeeId: true },
            },
            client: {
              select: { name: true, city: true },
            },
          },
          orderBy: { checkInTime: 'desc' },
        }),
      ]);

      const activeToday = todaysAttendance.length;

      res.status(200).json({
        success: true,
        data: {
          totalEmployees,
          activeToday,
          complianceRate: totalEmployees > 0 ? (activeToday / totalEmployees) * 100 : 0,
          todaysAttendance,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
