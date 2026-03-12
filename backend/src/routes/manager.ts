import { Router } from 'express';
import { managerController } from '../controllers/managerController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export const managerRoutes: Router = Router();

// Apply authentication and Manager role check to all routes
managerRoutes.use(authenticate, requireRole(['manager', 'admin']));

managerRoutes.get('/dashboard', managerController.getDashboardStats);
