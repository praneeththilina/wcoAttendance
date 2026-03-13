import { createServer } from 'http';
import dotenv from 'dotenv';

dotenv.config();

import { createApp } from './config/app.js';
import prisma from './config/database.js';

const app = createApp();

const server = createServer(async (req, res) => {
  if (req.url === '/health' || req.url === '/api/health') {
    const health: { status: string; timestamp: string; database?: string } = {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };

    try {
      await prisma.$queryRaw`SELECT 1`;
      health.database = 'connected';
    } catch {
      health.status = 'degraded';
      health.database = 'disconnected';
    }

    res.writeHead(health.status === 'ok' ? 200 : 503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(health));
    return;
  }
  
  app(req, res);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
