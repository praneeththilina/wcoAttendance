import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';
import type { AuthRequest } from '../middleware/auth.js';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = loginSchema.shape.body.parse(req.body);
    const result = await authService.login({
      email: validated.email,
      password: validated.password,
      rememberMe: validated.rememberMe,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: { code: 'REFRESH_TOKEN_REQUIRED', message: 'Refresh token is required' },
      });
      return;
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.userId;
    await authService.logout(userId || '');

    res.status(200).json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({
      success: true,
      data: { user: (req as AuthRequest).user },
    });
  } catch (error) {
    next(error);
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = registerSchema.shape.body.parse(req.body);
    const { email, password, firstName, lastName, employeeId } = validated;

    // Explicitly omit role to prevent privilege escalation via mass assignment.
    // The role will default to 'employee' in the service layer.
    const result = await authService.register({ email, password, firstName, lastName, employeeId });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as AuthRequest).user?.userId;
    const { firstName, lastName, profilePicture } = req.body;

    const result = await authService.updateProfile(userId!, { firstName, lastName, profilePicture });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
