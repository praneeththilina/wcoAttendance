import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './config/app.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
