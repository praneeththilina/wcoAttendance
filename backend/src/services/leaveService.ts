import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError.js';

const prisma = new PrismaClient();

export async function getLeaveBalance(userId: string, year: number) {
  let balance = await prisma.leaveBalance.findUnique({
    where: {
      userId_year: {
        userId,
        year,
      },
    },
  });

  if (!balance) {
    // If no balance exists, create default balance (7 sick, 15 annual)
    balance = await prisma.leaveBalance.create({
      data: {
        userId,
        year,
        sickLeaveTotal: 7,
        annualLeaveTotal: 15,
      },
    });
  }

  return balance;
}

export async function setLeaveBalance(userId: string, year: number, sickTotal?: number, annualTotal?: number) {
  return await prisma.leaveBalance.upsert({
    where: {
      userId_year: {
        userId,
        year,
      },
    },
    update: {
      ...(sickTotal !== undefined && { sickLeaveTotal: sickTotal }),
      ...(annualTotal !== undefined && { annualLeaveTotal: annualTotal }),
    },
    create: {
      userId,
      year,
      sickLeaveTotal: sickTotal ?? 7,
      annualLeaveTotal: annualTotal ?? 15,
    },
  });
}

export async function createLeaveRequest(userId: string, data: {
  type: 'sick' | 'annual' | 'unpaid' | 'other';
  startDate: string;
  endDate: string;
  reason?: string;
  days: number;
}) {
  const year = new Date(data.startDate).getFullYear();
  const balance = await getLeaveBalance(userId, year);

  // Check if enough balance exists for sick and annual
  if (data.type === 'sick') {
    if (balance.sickLeaveUsed + data.days > balance.sickLeaveTotal) {
      throw new AppError('Insufficient sick leave balance for this year', 400);
    }
  } else if (data.type === 'annual') {
    if (balance.annualLeaveUsed + data.days > balance.annualLeaveTotal) {
      throw new AppError('Insufficient annual leave balance for this year', 400);
    }
  }

  return await prisma.leaveRequest.create({
    data: {
      userId,
      type: data.type,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      reason: data.reason,
      days: data.days,
      status: 'pending',
    },
  });
}

export async function getLeaveRequests(params: {
  userId?: string;
  status?: 'pending' | 'approved' | 'rejected';
  page: number;
  limit: number;
}) {
  const where: any = {
    ...(params.userId && { userId: params.userId }),
    ...(params.status && { status: params.status }),
  };

  const [records, total] = await Promise.all([
    prisma.leaveRequest.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            employeeId: true,
          },
        },
      },
    }),
    prisma.leaveRequest.count({ where }),
  ]);

  return {
    data: records,
    pagination: {
      total,
      page: params.page,
      limit: params.limit,
      pages: Math.ceil(total / params.limit),
    },
  };
}

export async function updateLeaveRequestStatus(requestId: string, status: 'approved' | 'rejected', reviewerId: string) {
  const leaveRequest = await prisma.leaveRequest.findUnique({
    where: { id: requestId },
  });

  if (!leaveRequest) {
    throw new AppError('Leave request not found', 404);
  }

  if (leaveRequest.status !== 'pending') {
    throw new AppError(`Cannot update request that is already ${leaveRequest.status}`, 400);
  }

  const updatedRequest = await prisma.$transaction(async (tx) => {
    const updated = await tx.leaveRequest.update({
      where: { id: requestId },
      data: {
        status,
        approvedBy: reviewerId,
      },
    });

    if (status === 'approved') {
      const year = new Date(leaveRequest.startDate).getFullYear();
      const balance = await tx.leaveBalance.findUnique({
        where: { userId_year: { userId: leaveRequest.userId, year } }
      });

      if (!balance) throw new AppError('Leave balance entry missing', 500);

      if (leaveRequest.type === 'sick') {
        await tx.leaveBalance.update({
          where: { id: balance.id },
          data: { sickLeaveUsed: balance.sickLeaveUsed + leaveRequest.days }
        });
      } else if (leaveRequest.type === 'annual') {
        await tx.leaveBalance.update({
          where: { id: balance.id },
          data: { annualLeaveUsed: balance.annualLeaveUsed + leaveRequest.days }
        });
      } else if (leaveRequest.type === 'unpaid') {
        await tx.leaveBalance.update({
          where: { id: balance.id },
          data: { unpaidLeaveUsed: balance.unpaidLeaveUsed + leaveRequest.days }
        });
      } else {
        await tx.leaveBalance.update({
          where: { id: balance.id },
          data: { otherLeaveUsed: balance.otherLeaveUsed + leaveRequest.days }
        });
      }
    }

    return updated;
  });

  return updatedRequest;
}
