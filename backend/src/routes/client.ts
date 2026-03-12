import { Router, type Router as RouterType } from 'express';
import * as clientController from '../controllers/clientController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', clientController.getClients);
router.get('/recent', clientController.getRecentClients);
router.get('/search', clientController.searchClients);

export const clientRoutes: RouterType = router;
