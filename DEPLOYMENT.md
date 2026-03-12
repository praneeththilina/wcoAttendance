# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Backend + Frontend)

#### Backend on Vercel:
1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Import your backend folder as a new project
4. Add environment variables:
   - `DATABASE_URL` (Supabase pooler URL)
   - `JWT_SECRET`
   - `CORS_ORIGIN` (your frontend URL)
5. Deploy!

#### Frontend on Vercel:
```bash
cd frontend
npm i -g vercel
vercel
```

### Option 2: Render (Recommended - Free)
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Create new **Web Service**
4. Connect your GitHub repo
5. Settings:
   - Build Command: `cd backend && pnpm install && pnpm build`
   - Start Command: `node dist/index.js`
6. Add environment variables:
   - `DATABASE_URL` (Supabase connection string)
   - `JWT_SECRET` (your secret key)
   - `CORS_ORIGIN` (your frontend URL)

### Option 3: Railway
1. Push code to GitHub
2. Go to [Railway](https://railway.app)
3. Create new project from GitHub
4. Add PostgreSQL plugin (or use Supabase)
5. Add environment variables in Railway dashboard

### Option 4: Docker (Self-Hosted)
```bash
# Build and run with Docker
docker-compose up --build

# Or just frontend with nginx
cd frontend
docker build -t attendance-frontend .
docker run -p 3000:3000 attendance-frontend
```

## Environment Variables Needed

For backend:
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://your-app.vercel.app
```

## Supabase Connection
Use the **pooler URL** for better performance:
```
postgresql://postgres:password@db.xyz.supabase.co:6543/postgres
```

## Health Check
Backend exposes `/health` endpoint for monitoring.
