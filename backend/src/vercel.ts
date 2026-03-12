import { createServer } from 'http';
import dotenv from 'dotenv';

dotenv.config();

import { createApp } from './config/app.js';

const app = createApp();

const server = createServer((req, res) => {
  // Handle /health endpoint at root for Vercel
  if (req.url === '/health' || req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }
  
  app(req, res);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
