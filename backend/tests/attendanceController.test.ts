import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkIn } from '../src/controllers/attendanceController.js';
import * as attendanceService from '../src/services/attendanceService.js';
import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../src/middleware/auth.js';

vi.mock('../src/services/attendanceService.js');

describe('Attendance Controller', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('checkIn', () => {
    it('should pass error to next() when service throws', async () => {
      // Setup mock error
      const mockError = new Error('Database connection failed');
      vi.mocked(attendanceService.checkIn).mockRejectedValue(mockError);

      // Setup mock request
      const req = {
        body: {
          clientId: 'client-123',
          location: { latitude: 40.7128, longitude: -74.0060 }
        },
        user: { userId: 'user-123' }
      } as unknown as AuthRequest;

      // Setup mock response and next
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      // Call controller
      await checkIn(req, res, next);

      // Verify next was called with error
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
