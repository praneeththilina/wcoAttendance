import prisma from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import type { CheckInInput, CheckOutInput } from '../validators/attendance.validator.js';

const CHECK_IN_DEADLINE_HOUR = 8;
const CHECK_IN_DEADLINE_MINUTE = 30;
const MAX_DISTANCE_METERS = 500;
const MAX_IMPOSSIBLE_TRAVEL_SPEED_KMH = 500;

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function validateLocation(location: LocationData | undefined, client: { latitude: number | null; longitude: number | null }): { valid: boolean; error?: string; warning?: string } {
  if (!location) {
    return { valid: false, error: 'Location is required' };
  }

  if (location.accuracy && location.accuracy > 100) {
    return { valid: false, error: 'Location accuracy is too low. Please enable GPS.' };
  }

  if (location.accuracy && location.accuracy < 5) {
    return { valid: true, warning: 'Suspiciously high location accuracy detected' };
  }

  if (client.latitude !== null && client.longitude !== null) {
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      client.latitude,
      client.longitude
    );

    if (distance > MAX_DISTANCE_METERS) {
      return { valid: false, error: `You are ${Math.round(distance)}m away from the client location (max: ${MAX_DISTANCE_METERS}m)` };
    }
  }

  return { valid: true };
}

function isWithinDeadline(): boolean {
  const now = new Date();
  const deadline = new Date(now);
  deadline.setHours(CHECK_IN_DEADLINE_HOUR, CHECK_IN_DEADLINE_MINUTE, 0, 0);
  return now.getTime() <= deadline.getTime();
}

async function checkImpossibleTravel(userId: string, location: LocationData): Promise<{ valid: boolean; error?: string }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const lastAttendance = await prisma.attendanceRecord.findFirst({
    where: {
      userId,
      checkInTime: {
        gte: today,
        lt: tomorrow,
      },
      status: 'checked_out',
    },
    orderBy: {
      checkOutTime: 'desc',
    },
  });

  if (!lastAttendance?.checkOutLocation) {
    return { valid: true };
  }

  const lastLocation = lastAttendance.checkOutLocation as unknown as LocationData;
  if (!lastLocation?.latitude || !lastLocation?.longitude) {
    return { valid: true };
  }

  const distance = calculateDistance(
    location.latitude,
    location.longitude,
    lastLocation.latitude,
    lastLocation.longitude
  );

  if (!lastAttendance.checkOutTime) {
    return { valid: true };
  }

  const lastCheckOutTime = new Date(lastAttendance.checkOutTime).getTime();
  const now = Date.now();
  const timeDiffHours = (now - lastCheckOutTime) / (1000 * 60 * 60);

  if (timeDiffHours > 0 && timeDiffHours < 24) {
    const speedKmh = (distance / 1000) / timeDiffHours;
    if (speedKmh > MAX_IMPOSSIBLE_TRAVEL_SPEED_KMH) {
      return { valid: false, error: `Impossible travel detected: ${Math.round(speedKmh)} km/h since last check-out` };
    }
  }

  return { valid: true };
}

export async function checkIn(userId: string, input: CheckInInput) {
  const { clientId, location } = input;

  const client = await prisma.client.findUnique({
    where: { id: clientId, isActive: true },
  });

  if (!client) {
    throw new AppError('Client not found or inactive', 404);
  }

  const locationValidation = validateLocation(location as LocationData | undefined, client);
  if (!locationValidation.valid) {
    throw new AppError(locationValidation.error || 'Location validation failed', 400);
  }

  if (location) {
    const impossibleTravelCheck = await checkImpossibleTravel(userId, location as LocationData);
    if (!impossibleTravelCheck.valid) {
      throw new AppError(impossibleTravelCheck.error || 'Suspicious activity detected', 403);
    }
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

  const isOnTime = isWithinDeadline();
  const warnings: string[] = [];

  if (!isOnTime) {
    warnings.push('Check-in submitted after deadline (8:30 AM)');
  }

  if (locationValidation.warning) {
    warnings.push(locationValidation.warning);
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

  return {
    ...attendance,
    warnings: warnings.length > 0 ? warnings : undefined,
    isOnTime,
  };
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

  if (location) {
    const locationValidation = validateLocation(location as LocationData | undefined, attendance.client);
    if (!locationValidation.valid) {
      throw new AppError(locationValidation.error || 'Location validation failed', 400);
    }
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
