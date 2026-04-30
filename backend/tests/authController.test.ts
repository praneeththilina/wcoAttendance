import { describe, it, expect, vi } from 'vitest';
import { login } from '../src/controllers/authController.js';
import * as authService from '../src/services/authService.js';
import { Request, Response, NextFunction } from 'express';

vi.mock('../src/services/authService.js', () => ({
  login: vi.fn(),
}));

describe('Auth Controller', () => {
  describe('login', () => {
    it('should call next with error if authService.login throws an error', async () => {
      const mockError = new Error('Database error');
      vi.mocked(authService.login).mockRejectedValue(mockError);

      const req = {
        body: {
          username: 'test@example.com',
          email: 'test@example.com',
          password: 'password1234',
        },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
