import { Router } from 'express';
import { hrController } from '../controllers/hrController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export const hrRoutes: Router = Router();

// Apply authentication and HR role check to all routes
hrRoutes.use(authenticate, requireRole(['hr', 'admin']));

hrRoutes.get('/dashboard', hrController.getDashboardStats);
