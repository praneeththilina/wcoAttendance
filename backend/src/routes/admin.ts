import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../validators/index.js';
import { createStaffSchema, updateStaffSchema, getDailyReportSchema, updateSettingsSchema, createClientSchema, updateClientSchema } from '../validators/admin.validator.js';

export const adminRoutes: Router = Router();

// Apply authentication and admin role check
adminRoutes.use(authenticate, requireRole(['admin']));

// Admin Dashboard & Reports
adminRoutes.get('/dashboard', adminController.getDashboardStats);
adminRoutes.get('/reports/daily', validate(getDailyReportSchema.shape), adminController.getDailyReport);

// Staff Management
adminRoutes.get('/staff', adminController.getAllStaff);
adminRoutes.post('/staff', validate(createStaffSchema.shape), adminController.createStaff);
adminRoutes.put('/staff/:id', validate(updateStaffSchema.shape), adminController.updateStaff);

// Client endpoints
adminRoutes.get('/clients', adminController.getAllClients);
adminRoutes.post('/clients', validate(createClientSchema.shape), adminController.createClient);
adminRoutes.put('/clients/:id', validate(updateClientSchema.shape), adminController.updateClient);
adminRoutes.delete('/clients/:id', adminController.deleteClient);

// Settings endpoints
adminRoutes.get('/settings', adminController.getSettings);
adminRoutes.put('/settings', validate(updateSettingsSchema.shape), adminController.updateSettings);
