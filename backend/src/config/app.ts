import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { authRoutes } from '../routes/auth.js';
import { attendanceRoutes } from '../routes/attendance.js';
import { clientRoutes } from '../routes/client.js';
import { hrRoutes } from '../routes/hr.js';
import { managerRoutes } from '../routes/manager.js';
import { adminRoutes } from '../routes/admin.js';
import { leaveRoutes } from '../routes/leave.js';

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
// PORT is used in index.ts

export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later.',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression
  app.use(compression());

  // Logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
  }

  // Health check endpoints
  const healthHandler = (_req: express.Request, res: express.Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  };

  app.get('/health', healthHandler);
  app.get('/api/health', healthHandler);

  // API routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/attendance', attendanceRoutes);
  app.use('/api/v1/clients', clientRoutes);
  app.use('/api/v1/hr', hrRoutes);
  app.use('/api/v1/manager', managerRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/leaves', leaveRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.originalUrl} not found`,
      },
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
