import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/config/app.js';
import prisma from '../src/config/database.js';
import bcrypt from 'bcryptjs';

const app = createApp();

describe('Attendance & Client API', () => {
  let accessToken: string;
  let clientId: string;
  const testUser = {
    email: 'attendance.test@example.com',
    password: 'password123',
    firstName: 'Attendance',
    lastName: 'Tester',
    employeeId: 'TEST-ATT-001',
  };

  beforeAll(async () => {
    // Clean up
    await prisma.attendanceRecord.deleteMany({ where: { user: { email: testUser.email } } });
    await prisma.user.deleteMany({ where: { email: testUser.email } });

    // Create user
    const passwordHash = await bcrypt.hash(testUser.password, 10);
    const user = await prisma.user.create({
      data: {
        email: testUser.email,
        passwordHash,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        employeeId: testUser.employeeId,
        role: 'employee',
      },
    });

    // Get a client ID from seeded data
    const client = await prisma.client.findFirst();
    clientId = client!.id;

    // Login
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    accessToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    await prisma.attendanceRecord.deleteMany({ where: { user: { email: testUser.email } } });
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  describe('Client Management (Task 2.1)', () => {
    it('should get all clients', async () => {
      const res = await request(app)
        .get('/api/v1/clients')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should search clients', async () => {
      const res = await request(app)
        .get('/api/v1/clients/search?q=Acme')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('Attendance Flow (Tasks 2.2, 2.3, 2.4)', () => {
    it('should check in successfully', async () => {
      const res = await request(app)
        .post('/api/v1/attendance/check-in')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          clientId,
          location: { latitude: 40.7128, longitude: -74.0060 }
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('checked_in');
    });

    it('should fail to check in again on the same day', async () => {
      const res = await request(app)
        .post('/api/v1/attendance/check-in')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          clientId,
          location: { latitude: 40.7128, longitude: -74.0060 }
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should get today status as checked_in', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/today')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('checked_in');
      expect(res.body.data.attendance.clientId).toBe(clientId);
    });

    it('should check out successfully', async () => {
      const res = await request(app)
        .post('/api/v1/attendance/check-out')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          location: { latitude: 40.7128, longitude: -74.0060 }
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('checked_out');
      expect(res.body.data.totalHours).toBeDefined();
    });
  });

  describe('Attendance History (Task 2.5)', () => {
    it('should get attendance history', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/history')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});
