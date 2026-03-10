# Node.js & Express Code Style Guide

## Overview

This style guide defines coding standards for Node.js backend development using Express, Prisma, and TypeScript in the AA Attendance project.

---

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   │   ├── authController.ts
│   │   ├── attendanceController.ts
│   │   └── clientController.ts
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── routes/          # Route definitions
│   │   ├── auth.ts
│   │   ├── attendance.ts
│   │   └── clients.ts
│   ├── services/        # Business logic
│   │   ├── authService.ts
│   │   ├── attendanceService.ts
│   │   └── clientService.ts
│   ├── utils/           # Utility functions
│   │   ├── logger.ts
│   │   ├── AppError.ts
│   │   └── catchAsync.ts
│   ├── validators/      # Zod schemas
│   │   ├── auth.validator.ts
│   │   └── attendance.validator.ts
│   ├── config/          # Configuration
│   │   ├── database.ts
│   │   └── app.ts
│   └── index.ts         # Entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
├── tests/               # Test files
├── .env                 # Environment variables
├── .env.example         # Environment template
└── package.json
```

---

## TypeScript Guidelines

### 1. Type Definitions

**Define types for request/response:**
```typescript
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};
```

### 2. Error Handling

**Create custom error class:**
```typescript
// utils/AppError.ts
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
```

**Use async error wrapper:**
```typescript
// utils/catchAsync.ts
import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const catchAsync = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

### 3. Return Types

**Always define return types:**
```typescript
// ✅ Good
async function getUserById(id: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
}

// ❌ Bad
async function getUserById(id: string) {
  // No return type
}
```

---

## Express Guidelines

### 1. Route Structure

**Use Express Router:**
```typescript
// routes/attendance.ts
import { Router } from 'express';
import { attendanceController } from '../controllers/attendanceController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate); // Protect all routes

router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.get('/today', attendanceController.getTodayStatus);
router.get('/history', attendanceController.getHistory);

export { router as attendanceRoutes };
```

### 2. Controller Pattern

**Use thin controllers with service layer:**
```typescript
// controllers/attendanceController.ts
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { attendanceService } from '../services/attendanceService';

export const attendanceController = {
  checkIn: catchAsync(async (req: AuthRequest, res: Response) => {
    const { clientId, location } = req.body;
    const userId = req.user!.id;

    const record = await attendanceService.checkIn(userId, clientId, location);

    res.status(201).json({
      success: true,
      data: record,
      message: 'Checked in successfully',
    });
  }),

  checkOut: catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { location } = req.body;

    const record = await attendanceService.checkOut(userId, location);

    res.json({
      success: true,
      data: record,
      message: 'Checked out successfully',
    });
  }),
};
```

### 3. Service Layer

**Business logic in services:**
```typescript
// services/attendanceService.ts
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const attendanceService = {
  async checkIn(userId: string, clientId: string, location: Location) {
    // Check if already checked in
    const existingRecord = await prisma.attendanceRecord.findFirst({
      where: {
        userId,
        checkOutTime: null,
      },
    });

    if (existingRecord) {
      throw new AppError('Already checked in', 400);
    }

    // Create check-in record
    const record = await prisma.attendanceRecord.create({
      data: {
        userId,
        clientId,
        checkInTime: new Date(),
        checkInLocation: location,
        status: 'checked_in',
      },
      include: {
        client: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return record;
  },

  async checkOut(userId: string, location: Location) {
    // Find active check-in
    const activeRecord = await prisma.attendanceRecord.findFirst({
      where: {
        userId,
        checkOutTime: null,
      },
    });

    if (!activeRecord) {
      throw new AppError('Not checked in', 400);
    }

    // Update with check-out
    const checkOutTime = new Date();
    const checkInTime = new Date(activeRecord.checkInTime);
    const totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

    const record = await prisma.attendanceRecord.update({
      where: { id: activeRecord.id },
      data: {
        checkOutTime,
        checkOutLocation: location,
        totalHours,
        status: 'checked_out',
      },
    });

    return record;
  },
};
```

---

## Middleware

### 1. Authentication Middleware

```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

interface JwtPayload {
  id: string;
  role: UserRole;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};
```

### 2. Role-Based Authorization

```typescript
// middleware/authorize.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Not authorized', 403);
    }

    next();
  };
};

// Usage
router.get('/admin', authenticate, authorize('admin', 'manager'), adminController.dashboard);
```

### 3. Validation Middleware

```typescript
// middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(error.errors[0].message, 400));
      } else {
        next(error);
      }
    }
  };
};
```

---

## Validation with Zod

### 1. Define Schemas

```typescript
// validators/auth.validator.ts
import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    employeeId: z.string().min(1, 'Employee ID is required'),
  }),
});
```

### 2. Use in Routes

```typescript
// routes/auth.ts
import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validate } from '../middleware/validation';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/register', validate(registerSchema), authController.register);

export { router as authRoutes };
```

---

## Database with Prisma

### 1. Schema Definition

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  employee
  admin
  manager
  hr
}

enum AttendanceStatus {
  checked_in
  checked_out
  incomplete
}

model User {
  id            String             @id @default(uuid())
  employeeId    String             @unique
  email         String             @unique
  passwordHash  String
  firstName     String
  lastName      String
  role          UserRole           @default(employee)
  isActive      Boolean            @default(true)
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt
  attendance    AttendanceRecord[]
  locationChanges LocationChange[]
}

model Client {
  id            String             @id @default(uuid())
  name          String
  branch        String?
  city          String
  address       String?
  latitude      Decimal?
  longitude     Decimal?
  isActive      Boolean            @default(true)
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt
  attendance    AttendanceRecord[]
}

model AttendanceRecord {
  id              String           @id @default(uuid())
  userId          String
  clientId        String
  checkInTime     DateTime
  checkOutTime    DateTime?
  checkInLocation Json?
  checkOutLocation Json?
  totalHours      Decimal?
  status          AttendanceStatus
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  user            User             @relation(fields: [userId], references: [id])
  client          Client           @relation(fields: [clientId], references: [id])

  @@index([userId])
  @@index([clientId])
  @@index([checkInTime])
}
```

### 2. Database Client

```typescript
// config/database.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
```

### 3. Query Best Practices

**Use transactions for related operations:**
```typescript
async function changeLocation(
  userId: string,
  fromClientId: string,
  toClientId: string,
  location: Location
) {
  return await prisma.$transaction(async (tx) => {
    // Update current attendance record
    await tx.attendanceRecord.updateMany({
      where: {
        userId,
        checkOutTime: null,
      },
      data: {
        clientId: toClientId,
      },
    });

    // Log location change
    const change = await tx.locationChange.create({
      data: {
        userId,
        fromClientId,
        toClientId,
        location,
      },
    });

    return change;
  });
}
```

**Use select to limit returned fields:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    role: true,
  },
});
```

---

## Error Handling

### 1. Global Error Handler

```typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: 'APP_ERROR',
        message: err.message,
      },
    });
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'A record with this value already exists',
        },
      });
    }
  }

  // Default error
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    },
  });
};
```

### 2. 404 Handler

```typescript
// middleware/notFound.ts
import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';

export const notFoundHandler = (req: Request, res: Response) => {
  throw new AppError(`Route ${req.originalUrl} not found`, 404);
};
```

---

## Logging

### 1. Logger Setup

```typescript
// utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
```

### 2. Request Logging

```typescript
// middleware/requestLogger.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });

  next();
};
```

---

## Security

### 1. Helmet Configuration

```typescript
// config/security.ts
import helmet from 'helmet';

export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
});
```

### 2. Rate Limiting

```typescript
// config/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

### 3. CORS Configuration

```typescript
// config/cors.ts
import cors from 'cors';

export const corsOptions: cors.CorsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

---

## Testing

### 1. Test Structure

```typescript
// tests/attendance.test.ts
import request from 'supertest';
import { app } from '../config/app';
import { prisma } from '../config/database';

describe('Attendance API', () => {
  beforeEach(async () => {
    // Clean database
    await prisma.attendanceRecord.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/v1/attendance/check-in', () => {
    it('should check in successfully', async () => {
      // Create test user
      const user = await prisma.user.create({
        data: {
          employeeId: 'EMP001',
          email: 'test@example.com',
          passwordHash: 'hashed_password',
          firstName: 'Test',
          lastName: 'User',
        },
      });

      // Generate token
      const token = jwt.sign({ id: user.id, role: 'employee' }, process.env.JWT_SECRET!);

      // Make request
      const response = await request(app)
        .post('/api/v1/attendance/check-in')
        .set('Authorization', `Bearer ${token}`)
        .send({
          clientId: 'client-123',
          location: { latitude: 40.7128, longitude: -74.0060 },
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('checked_in');
    });

    it('should return 400 if already checked in', async () => {
      // Test already checked in scenario
    });
  });
});
```

### 2. Test Coverage

**Aim for >80% coverage:**
- Controllers: Test all routes and status codes
- Services: Test business logic and edge cases
- Middleware: Test authentication, authorization, validation
- Validators: Test all schema validations

---

## Environment Variables

### .env.example

```env
# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aa_attendance

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Code Review Checklist

Before submitting code for review:

- [ ] TypeScript types are defined for all functions and variables
- [ ] No `any` types used
- [ ] Controllers are thin, business logic is in services
- [ ] Error handling is implemented with AppError
- [ ] Validation is done with Zod schemas
- [ ] Database queries use Prisma transactions where needed
- [ ] Authentication/authorization middleware is applied
- [ ] Logging is added for important operations
- [ ] Tests are written for new functionality
- [ ] Environment variables are used for configuration
- [ ] No sensitive data in logs
- [ ] API responses follow standard format
- [ ] Security headers are configured
- [ ] Rate limiting is applied where needed
