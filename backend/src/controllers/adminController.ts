import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError.js';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  branch: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isActive: z.boolean().default(true)
});

export const adminController = {
  // Dashboard and Reports
  getDashboardStats: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [totalEmployees, checkedInCount, attendanceRecords] = await Promise.all([
        prisma.user.count({ where: { role: { in: ['employee', 'manager', 'hr'] } } }),
        prisma.attendanceRecord.count({
          where: {
            checkInTime: { gte: today },
            status: 'checked_in'
          }
        }),
        prisma.attendanceRecord.findMany({
          where: {
            checkInTime: { gte: today },
          },
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, role: true }
            },
            client: {
              select: { name: true, city: true }
            }
          },
          orderBy: { checkInTime: 'desc' },
          take: 20
        })
      ]);

      let atOffice = 0;
      let atClientSites = 0;

      const liveStaff = attendanceRecords.map(record => {
        const isClientSite = record.client?.name && !record.client.name.toLowerCase().includes('office');
        if (record.status === 'checked_in') {
          if (isClientSite) atClientSites++;
          else atOffice++;
        }

        return {
          id: record.user.id,
          firstName: record.user.firstName,
          lastName: record.user.lastName,
          role: record.user.role,
          status: record.status,
          clientName: record.client?.name || null,
          clientCity: record.client?.city || null,
          checkInTime: record.checkInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
      });

      res.status(200).json({
        success: true,
        data: {
          totalEmployees,
          checkedIn: checkedInCount,
          atOffice,
          atClientSites,
          liveStaff
        }
      });
    } catch (error) {
      next(error);
    }
  },

  getDailyReport: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dateStr = req.query.date as string;
      if (!dateStr) return next(new AppError('Date is required', 400));
      
      const targetDate = new Date(dateStr);
      const nextDate = new Date(targetDate);
      nextDate.setDate(targetDate.getDate() + 1);

      const records = await prisma.attendanceRecord.findMany({
        where: {
          checkInTime: {
            gte: targetDate,
            lt: nextDate
          }
        },
        include: {
          user: {
            select: { firstName: true, lastName: true, role: true }
          },
          client: {
            select: { name: true }
          }
        },
        orderBy: { checkInTime: 'asc' }
      });

      const formattedRecords = records.map(r => ({
        id: r.id,
        employeeName: `${r.user.firstName} ${r.user.lastName}`,
        role: r.user.role,
        clientName: r.client?.name || 'Unknown',
        checkInTime: r.checkInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        checkOutTime: r.checkOutTime ? r.checkOutTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-',
        totalHours: r.totalHours ? Number(r.totalHours.toFixed(2)) : 0,
        status: r.status === 'checked_in' ? 'present' : (r.status === 'checked_out' ? 'present' : 'incomplete') // Simplified status map for now
      }));

      res.status(200).json({ success: true, data: formattedRecords });
    } catch (error) {
      next(error);
    }
  },

  // Staff Management
  getAllStaff: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          employeeId: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
        },
        orderBy: { firstName: 'asc' }
      });

      // Get today's attendance status for all users if possible
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const records = await prisma.attendanceRecord.findMany({
        where: { checkInTime: { gte: today } },
        select: { userId: true, status: true },
        orderBy: { checkInTime: 'desc' } // Get latest status
      });

      const userStatusMap = new Map();
      records.forEach(r => {
        if (!userStatusMap.has(r.userId)) userStatusMap.set(r.userId, r.status);
      });

      const data = users.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        status: user.isActive ? 'active' : 'inactive',
        todayStatus: userStatusMap.get(user.id) || 'not_reported'
      }));

      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  createStaff: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { employeeId, email, password, firstName, lastName, role, isActive } = req.body;
      
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { employeeId }] }
      });
      if (existingUser) return next(new AppError('User with email or employee ID already exists', 400));

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await prisma.user.create({
        data: {
          employeeId,
          email,
          passwordHash: hashedPassword,
          firstName,
          lastName,
          role,
          isActive: isActive ?? true
        },
        select: { id: true, email: true, firstName: true, lastName: true, role: true }
      });
      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      next(error);
    }
  },

  updateStaff: async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Exclude password from general updates; could create a separate endpoint for pw reset if needed
        delete updateData.password;

        const updatedUser = await prisma.user.update({
          where: { id },
          data: updateData,
          select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true }
        });
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        if ((error as any).code === 'P2025') return next(new AppError('Staff not found', 404));
        next(error);
    }
  },

  // Client Management
  getAllClients: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const clients = await prisma.client.findMany({
        orderBy: { name: 'asc' }
      });
      res.status(200).json({ success: true, data: clients });
    } catch (error) {
      next(error);
    }
  },

  createClient: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = clientSchema.parse(req.body);
      const newClient = await prisma.client.create({
        data: validatedData
      });
      res.status(201).json({ success: true, data: newClient });
    } catch (error) {
      next(error);
    }
  },

  updateClient: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const validatedData = clientSchema.partial().parse(req.body);
      
      const updatedClient = await prisma.client.update({
        where: { id },
        data: validatedData
      });
      res.status(200).json({ success: true, data: updatedClient });
    } catch (error) {
      // Prisma error for not found
      if ((error as any).code === 'P2025') {
        return next(new AppError('Client not found', 404));
      }
      next(error);
    }
  },

  deleteClient: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await prisma.client.delete({
        where: { id }
      });
      res.status(200).json({ success: true, message: 'Client deleted successfully' });
    } catch (error) {
       // Prisma error for not found
       if ((error as any).code === 'P2025') {
        return next(new AppError('Client not found', 404));
      }
      next(error);
    }
  }
};
