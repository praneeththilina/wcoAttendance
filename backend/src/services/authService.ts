import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import type { LoginInput } from '../validators/auth.validator.js';
import { Prisma } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'test' ? 'test-secret' : undefined);
if (!JWT_SECRET) {
  throw new Error('CRITICAL: JWT_SECRET environment variable is not set. Refusing to start insecurely.');
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  email?: string;
  role?: string;
  type?: string;
}

export async function login(input: LoginInput) {
  const { email, password, rememberMe } = input;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const tokenExpiry = rememberMe ? '7d' : JWT_EXPIRES_IN;

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: tokenExpiry as jwt.SignOptions['expiresIn'] }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      employeeId: user.employeeId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      profilePicture: user.profilePicture,
    },
  };
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as TokenPayload;

    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    return { accessToken };
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }
}

export async function logout(_userId: string) {
  return { message: 'Logged out successfully' };
}

export async function register(input: { email: string; password: string; firstName: string; lastName: string; employeeId: string; role?: string }) {
  const { email, password, firstName, lastName, employeeId, role = 'employee' } = input;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('Email already registered', 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      employeeId,
      role: role as any,
    },
  });

  return {
    id: user.id,
    employeeId: user.employeeId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
}

export async function updateProfile(userId: string, input: { firstName?: string; lastName?: string; profilePicture?: string }) {
  const { firstName, lastName, profilePicture } = input;

  const updateData: Record<string, unknown> = {};
  if (firstName !== undefined) updateData.firstName = firstName;
  if (lastName !== undefined) updateData.lastName = lastName;
  if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      employeeId: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      profilePicture: true,
    },
  });

  return user;
}
