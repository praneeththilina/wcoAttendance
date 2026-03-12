import prisma from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import type { CheckInInput, CheckOutInput } from '../validators/attendance.validator.js';

export async function checkIn(userId: string, input: CheckInInput) {
  const { clientId, location } = input;

  const client = await prisma.client.findUnique({
    where: { id: clientId, isActive: true },
  });

  if (!client) {
    throw new AppError('Client not found or inactive', 404);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingRecord = await prisma.attendanceRecord.findFirst({
    where: {
      userId,
      checkInTime: {
        gte: today,
        lt: tomorrow,
      },
      status: 'checked_in',
    },
  });

  if (existingRecord) {
    throw new AppError('You have already checked in today', 400);
  }

  const attendance = await prisma.attendanceRecord.create({
    data: {
      userId,
      clientId,
      checkInTime: new Date(),
      checkInLocation: location || undefined,
      status: 'checked_in',
    },
    include: {
      client: true,
      user: {
        select: {
          id: true,
          employeeId: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  return attendance;
}

export async function checkOut(userId: string, input: CheckOutInput) {
  const { location } = input;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const attendance = await prisma.attendanceRecord.findFirst({
    where: {
      userId,
      checkInTime: {
        gte: today,
        lt: tomorrow,
      },
      status: 'checked_in',
    },
    include: {
      client: true,
      user: {
        select: {
          id: true,
          employeeId: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!attendance) {
    throw new AppError('You have not checked in today', 400);
  }

  const checkOutTime = new Date();
  const checkInTime = new Date(attendance.checkInTime);
  const totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

  const updated = await prisma.attendanceRecord.update({
    where: { id: attendance.id },
    data: {
      checkOutTime,
      checkOutLocation: location || undefined,
      totalHours: parseFloat(totalHours.toFixed(2)),
      status: 'checked_out',
    },
    include: {
      client: true,
      user: {
        select: {
          id: true,
          employeeId: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  return updated;
}

export async function getTodayStatus(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const attendance = await prisma.attendanceRecord.findFirst({
    where: {
      userId,
      checkInTime: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      client: true,
    },
    orderBy: {
      checkInTime: 'desc',
    },
  });

  if (!attendance) {
    return {
      status: 'not_checked_in',
      attendance: null,
    };
  }

  let totalHours = null;
  if (attendance.checkOutTime) {
    const checkInTime = new Date(attendance.checkInTime);
    const checkOutTime = new Date(attendance.checkOutTime);
    totalHours = parseFloat(((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)).toFixed(2));
  }

  return {
    status: attendance.status,
    attendance: {
      ...attendance,
      totalHours,
    },
  };
}

export async function getHistory(userId: string, options: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) {
  const { page = 1, limit = 20, startDate, endDate } = options;
  const skip = (page - 1) * limit;

  const where: any = { userId };

  if (startDate || endDate) {
    where.checkInTime = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      where.checkInTime.gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.checkInTime.lte = end;
    }
  }

  const [records, total] = await Promise.all([
    prisma.attendanceRecord.findMany({
      where,
      include: {
        client: true,
      },
      orderBy: {
        checkInTime: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.attendanceRecord.count({ where }),
  ]);

  return {
    data: records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function changeLocation(userId: string, clientId: string, location?: { latitude: number; longitude: number }) {
  const client = await prisma.client.findUnique({
    where: { id: clientId, isActive: true },
  });

  if (!client) {
    throw new AppError('Client not found or inactive', 404);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingRecord = await prisma.attendanceRecord.findFirst({
    where: {
      userId,
      checkInTime: {
        gte: today,
        lt: tomorrow,
      },
      status: 'checked_in',
    },
  });

  if (!existingRecord) {
    throw new AppError('You are not checked in today', 400);
  }

  const updated = await prisma.attendanceRecord.update({
    where: { id: existingRecord.id },
    data: {
      clientId,
      checkInLocation: location || undefined,
    },
    include: {
      client: true,
    },
  });

  return updated;
}
