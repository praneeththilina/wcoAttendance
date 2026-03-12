import { Router, type Router as RouterType } from 'express';
import * as leaveController from '../controllers/leaveController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// Employee routes
router.get('/my-balance', leaveController.getMyBalance);
router.post('/request', leaveController.createLeaveRequest);
router.get('/my-requests', leaveController.getMyLeaveRequests);

// Admin/Manager/HR routes
const requireAdminOrManagerOrHr = requireRole(['admin', 'manager', 'hr']);
const requireAdminOrHr = requireRole(['admin', 'hr']);

router.get('/all-requests', requireAdminOrManagerOrHr, leaveController.getAllLeaveRequests);
router.put('/request/:id/status', requireAdminOrManagerOrHr, leaveController.updateLeaveRequestStatus);

// Specifically HR and Admin for balance set up
router.put('/balance/:userId', requireAdminOrHr, leaveController.updateLeaveBalance);

export const leaveRoutes: RouterType = router;
