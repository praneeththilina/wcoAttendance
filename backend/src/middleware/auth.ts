import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import type { TokenPayload } from '../services/authService.js';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'test' ? 'test-secret' : undefined);
if (!JWT_SECRET) {
  throw new Error('CRITICAL: JWT_SECRET environment variable is not set. Refusing to start insecurely.');
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    (req as AuthRequest).user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    (req as AuthRequest).user = decoded;
  } catch {
    // Ignore token errors for optional auth
  }

  next();
}

export function requireRole(roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(authReq.user.role as string)) {
      return next(new AppError('You do not have permission to access this resource', 403));
    }

    next();
  };
}
