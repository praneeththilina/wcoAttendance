import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkIn } from '../src/controllers/attendanceController.js';
import * as attendanceService from '../src/services/attendanceService.js';
import type { Request, Response, NextFunction } from 'express';
import type { AuthRequest } from '../src/middleware/auth.js';

// Mock the service
vi.mock('../src/services/attendanceService.js');

describe('attendanceController', () => {
  describe('checkIn', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it('should propagate errors to the error handling middleware', async () => {
      // Arrange
      const mockError = new Error('Service failure');
      vi.mocked(attendanceService.checkIn).mockRejectedValue(mockError);

      const req = {
        body: {
          clientId: 'client-123',
          location: { latitude: 10, longitude: 20 },
        },
        user: { userId: 'user-123' },
      } as unknown as AuthRequest;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      const next = vi.fn() as NextFunction;

      // Act
      await checkIn(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
