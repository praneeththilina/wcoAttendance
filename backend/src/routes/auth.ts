import { Router, type Router as RouterType } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../validators/index.js';
import { updateProfileSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);
router.put(
  '/profile',
  authenticate,
  validate(updateProfileSchema.shape),
  authController.updateProfile
);

export const authRoutes: RouterType = router;
