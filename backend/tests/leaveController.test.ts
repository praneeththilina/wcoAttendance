import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { getMyLeaveRequests, getAllLeaveRequests } from '../src/controllers/leaveController.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import * as leaveService from '../src/services/leaveService.js';

vi.mock('../src/services/leaveService.js', () => ({
  getLeaveRequests: vi.fn(),
  getLeaveBalance: vi.fn(),
  createLeaveRequest: vi.fn(),
  updateLeaveRequestStatus: vi.fn(),
  setLeaveBalance: vi.fn(),
}));

const app = express();
app.use(express.json());

// Mock auth middleware inline
app.use((req, res, next) => {
  (req as any).user = { userId: 'test-user', role: 'admin' };
  next();
});

app.get('/my-requests', getMyLeaveRequests);
app.get('/all-requests', getAllLeaveRequests);

app.use(errorHandler);

describe('Leave Controller Error Tests', () => {
  it('getMyLeaveRequests should return 500 status code when service throws an error', async () => {
    vi.mocked(leaveService.getLeaveRequests).mockRejectedValueOnce(new Error('Service failed'));

    const res = await request(app).get('/my-requests');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
  });

  it('getAllLeaveRequests should return 500 status code when service throws an error', async () => {
    vi.mocked(leaveService.getLeaveRequests).mockRejectedValueOnce(new Error('Service failed'));

    const res = await request(app).get('/all-requests');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
  });
});
