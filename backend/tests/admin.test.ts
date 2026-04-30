import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/config/app.js';
import prisma from '../src/config/database.js';
import bcrypt from 'bcryptjs';

const app = createApp();

describe('Admin API', () => {
  let adminToken: string;
  let employeeId: string;
  let clientId: string;

  const testAdmin = {
    email: 'admin.test@example.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'Tester',
    employeeId: 'TEST-ADM-001',
    role: 'admin'
  };

  const testEmployee = {
    email: 'emp.test@example.com',
    password: 'password123',
    firstName: 'Emp',
    lastName: 'Tester',
    employeeId: 'TEST-EMP-001',
    role: 'employee'
  };

  beforeAll(async () => {
    // Clean up
    await prisma.attendanceRecord.deleteMany({
      where: { user: { email: { in: [testAdmin.email, testEmployee.email] } } }
    });
    await prisma.user.deleteMany({
      where: { email: { in: [testAdmin.email, testEmployee.email] } }
    });
    await prisma.client.deleteMany({
      where: { name: 'Test Admin Client' }
    });

    // Create admin user
    const passwordHash = await bcrypt.hash(testAdmin.password, 10);
    await prisma.user.create({
      data: {
        email: testAdmin.email,
        passwordHash,
        firstName: testAdmin.firstName,
        lastName: testAdmin.lastName,
        employeeId: testAdmin.employeeId,
        role: testAdmin.role,
      },
    });

    // Login admin
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testAdmin.email,
        password: testAdmin.password,
      });
    adminToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    await prisma.attendanceRecord.deleteMany({
      where: { user: { email: { in: [testAdmin.email, testEmployee.email] } } }
    });
    await prisma.user.deleteMany({
      where: { email: { in: [testAdmin.email, testEmployee.email] } }
    });
    await prisma.client.deleteMany({
      where: { name: 'Test Admin Client' }
    });
    await prisma.$disconnect();
  });

  describe('Dashboard & Reports', () => {
    it('should get dashboard stats', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalEmployees');
      expect(res.body.data).toHaveProperty('checkedIn');
      expect(res.body.data).toHaveProperty('atOffice');
      expect(res.body.data).toHaveProperty('atClientSites');
      expect(res.body.data).toHaveProperty('liveStaff');
      expect(Array.isArray(res.body.data.liveStaff)).toBe(true);
    });

    it('should get daily report for a specific date', async () => {
      const today = new Date().toISOString().split('T')[0];
      const res = await request(app)
        .get(`/api/v1/admin/reports/daily?date=${today}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should fail getting daily report without date', async () => {
      const res = await request(app)
        .get('/api/v1/admin/reports/daily')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Staff Management', () => {
    it('should get all staff', async () => {
      const res = await request(app)
        .get('/api/v1/admin/staff')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should create a new staff member', async () => {
      const res = await request(app)
        .post('/api/v1/admin/staff')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testEmployee);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testEmployee.email);
      employeeId = res.body.data.id;
    });

    it('should fail creating staff with duplicate email', async () => {
      const res = await request(app)
        .post('/api/v1/admin/staff')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testEmployee);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should update a staff member', async () => {
      const res = await request(app)
        .put(`/api/v1/admin/staff/${employeeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'UpdatedEmp',
          isActive: false
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.firstName).toBe('UpdatedEmp');
      expect(res.body.data.isActive).toBe(false);
    });

    it('should fail updating non-existent staff member', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .put(`/api/v1/admin/staff/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'Ghost'
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Client Management', () => {
    it('should get all clients', async () => {
      const res = await request(app)
        .get('/api/v1/admin/clients')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should create a new client', async () => {
      const res = await request(app)
        .post('/api/v1/admin/clients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Admin Client',
          address: '123 Admin St',
          city: 'Test City'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Admin Client');
      clientId = res.body.data.id;
    });

    it('should update a client', async () => {
      const res = await request(app)
        .put(`/api/v1/admin/clients/${clientId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          city: 'Updated City'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.city).toBe('Updated City');
    });

    it('should delete a client', async () => {
      const res = await request(app)
        .delete(`/api/v1/admin/clients/${clientId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deletion
      const getRes = await request(app)
        .get('/api/v1/admin/clients')
        .set('Authorization', `Bearer ${adminToken}`);

      const clients = getRes.body.data;
      expect(clients.some((c: any) => c.id === clientId)).toBe(false);
    });
  });

  describe('Settings Management', () => {
    it('should get settings', async () => {
      const res = await request(app)
        .get('/api/v1/admin/settings')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('checkInDeadlineHour');
    });

    it('should update settings', async () => {
      const res = await request(app)
        .put('/api/v1/admin/settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          checkInDeadlineHour: 9,
          maxDistanceMeters: 1000
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.checkInDeadlineHour).toBe(9);
      expect(res.body.data.maxDistanceMeters).toBe(1000);

      // Restore settings for other tests
      await request(app)
        .put('/api/v1/admin/settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          checkInDeadlineHour: 8,
          maxDistanceMeters: 500
        });
    });
  });
});
