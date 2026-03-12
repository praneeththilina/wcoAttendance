import { Router, type Router as RouterType } from 'express';
import * as attendanceController from '../controllers/attendanceController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.post('/change-location', attendanceController.changeLocation);
router.get('/today', attendanceController.getToday);
router.get('/history', attendanceController.getHistory);

export const attendanceRoutes: RouterType = router;
