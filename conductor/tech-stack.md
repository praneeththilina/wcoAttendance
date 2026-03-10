# Technology Stack

## Overview

This document defines the complete technology stack for the **AA Attendance** audit firm attendance tracking system. The stack is selected for:

- **Mobile-first performance** - Fast load times on mobile networks
- **Offline support** - PWA capabilities for field auditors
- **Real-time updates** - Live dashboard for admin staff
- **Scalability** - Handle 500+ concurrent users
- **Developer experience** - Modern tooling and clear architecture

---

## Frontend Stack

### Core Framework

**React 18+**
- Component-based architecture for reusable UI
- Hooks-based state management
- Concurrent rendering for smooth UX
- Large ecosystem and community support

**Why React**: Best-in-class for PWAs, excellent mobile performance, strong TypeScript support

### Build Tool

**Vite 5+**
- Lightning-fast HMR (Hot Module Replacement)
- Optimized production builds
- Native ES modules support
- Rollup-based production builds

**Why Vite**: 10-100x faster than webpack for development, optimized for production

### Styling

**Tailwind CSS 3+**
- Utility-first CSS framework
- Mobile-first responsive design
- Dark mode support built-in
- Custom configuration via `tailwind.config.js`

**Configuration** (from existing mockups):
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2c1a4c',
        'primary-light': '#3d2469',
        'background-light': '#f7f6f8',
        'background-dark': '#18141e',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      },
      fontFamily: {
        display: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
```

**Why Tailwind**: Matches existing mockups, rapid development, consistent design system

### Icons & Typography

**Material Symbols (Google Fonts)**
- Outlined icons by default
- Filled variants for active states
- Variable font weight support
- Self-hosted or CDN

**Inter Font Family**
- Google Fonts
- Weights: 400, 500, 600, 700
- Optimized for screens
- Excellent readability at small sizes

### State Management

**Zustand** (Recommended)
- Minimal boilerplate
- TypeScript-first
- DevTools support
- Persist middleware for offline storage

**Alternative**: React Context + useReducer for simpler state

### HTTP Client

**Axios**
- Request/response interceptors
- Automatic JSON transformation
- Cancel requests
- TypeScript support

### PWA Support

**Vite PWA Plugin**
- Service Worker generation
- Offline caching
- Add to home screen
- Push notifications ready

**Key Features**:
- Offline check-in/check-out with sync
- Cached client list
- Cached assets for instant load

### Form Handling

**React Hook Form**
- Minimal re-renders
- Built-in validation
- TypeScript support
- Easy integration with Zod

### Validation

**Zod**
- Schema validation
- TypeScript inference
- Runtime type checking
- Error messages

---

## Backend Stack

### Runtime

**Node.js 20 LTS**
- Long-term support
- Performance improvements
- Modern JavaScript features
- Large ecosystem

### Framework

**Express.js 4+**
- Minimal, flexible
- Large middleware ecosystem
- Easy to learn
- Production-proven

**Why Express**: Simple API design, great for REST APIs, extensive middleware support

### Database ORM

**Prisma ORM**
- Type-safe database access
- Auto-generated TypeScript types
- Migrations support
- Intuitive API

**Why Prisma**: Best DX, type safety, excellent TypeScript integration

### Database

**PostgreSQL 15+**
- Relational database
- ACID compliance
- JSON support for flexible data
- Excellent for structured attendance data

**Why PostgreSQL**: Reliable, scalable, perfect for relational attendance data

### Authentication

**JWT (JSON Web Tokens)**
- Stateless authentication
- Token-based sessions
- Refresh token rotation
- Role-based access control

**Library**: `jsonwebtoken` + `bcryptjs`

**Features**:
- Email/Employee ID login
- Password hashing with bcrypt
- Token expiration and refresh
- Role-based middleware

### Validation

**Zod** (Shared with frontend)
- Shared validation schemas
- Type inference
- Runtime validation

### File Upload

**Multer**
- Handle file uploads
- Avatar uploads
- Report exports

---

## Database Schema

### Core Tables

**Users**
```sql
- id: UUID (PK)
- employee_id: VARCHAR(20) (UNIQUE)
- email: VARCHAR(255) (UNIQUE)
- password_hash: VARCHAR(255)
- first_name: VARCHAR(100)
- last_name: VARCHAR(100)
- role: ENUM('employee', 'admin', 'manager', 'hr')
- is_active: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Clients**
```sql
- id: UUID (PK)
- name: VARCHAR(255)
- branch: VARCHAR(100)
- city: VARCHAR(100)
- address: TEXT
- latitude: DECIMAL(10, 8)
- longitude: DECIMAL(11, 8)
- is_active: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Attendance Records**
```sql
- id: UUID (PK)
- user_id: UUID (FK -> Users.id)
- client_id: UUID (FK -> Clients.id)
- check_in_time: TIMESTAMP
- check_out_time: TIMESTAMP
- check_in_location: JSONB (lat, lng, accuracy)
- check_out_location: JSONB
- total_hours: DECIMAL(5, 2)
- status: ENUM('checked_in', 'checked_out', 'incomplete')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Location Changes**
```sql
- id: UUID (PK)
- user_id: UUID (FK -> Users.id)
- from_client_id: UUID (FK -> Clients.id)
- to_client_id: UUID (FK -> Clients.id)
- changed_at: TIMESTAMP
- location: JSONB
```

**Admin Users** (Optional, or use Users table with role)
```sql
- id: UUID (PK)
- user_id: UUID (FK -> Users.id)
- permissions: JSONB
```

---

## API Design

### RESTful API Structure

**Base URL**: `/api/v1`

### Authentication Endpoints

```
POST   /auth/login          - User login
POST   /auth/logout         - User logout
POST   /auth/refresh        - Refresh token
POST   /auth/forgot-password - Request password reset
POST   /auth/reset-password  - Reset password
```

### Employee Endpoints

```
GET    /attendance/today           - Get today's attendance status
POST   /attendance/check-in        - Check in
POST   /attendance/check-out       - Check out
POST   /attendance/change-location - Change client location
GET    /attendance/history         - Get attendance history
GET    /clients                    - Get all clients
GET    /clients/recent             - Get recent clients
GET    /clients/search             - Search clients
GET    /profile                    - Get user profile
PUT    /profile                    - Update profile
```

### Admin Endpoints

```
GET    /admin/dashboard            - Get dashboard stats
GET    /admin/attendance           - Get all attendance records
GET    /admin/attendance/:date     - Get attendance for specific date
GET    /admin/employees            - Get all employees
GET    /admin/employees/:id        - Get employee details
GET    /admin/clients              - Get all clients
POST   /admin/clients              - Create client
PUT    /admin/clients/:id          - Update client
DELETE /admin/clients/:id          - Delete client
```

### Report Endpoints

```
GET    /reports/daily              - Generate daily report
GET    /reports/weekly             - Generate weekly report
GET    /reports/monthly            - Generate monthly report
GET    /reports/export/excel       - Export to Excel
GET    /reports/export/pdf         - Export to PDF
```

### Response Format

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

---

## Development Tools

### Package Manager

**pnpm** (Recommended)
- Faster than npm/yarn
- Disk space efficient
- Strict dependency handling

**Alternative**: npm or yarn

### Code Quality

**ESLint**
- React-specific rules
- TypeScript support
- Prettier integration

**Prettier**
- Code formatting
- Consistent style
- Pre-commit hooks

**Husky**
- Git hooks
- Pre-commit linting
- Pre-commit tests

### Testing

**Vitest** (Recommended with Vite)
- Fast unit testing
- Vite-native
- Coverage reports

**React Testing Library**
- Component testing
- User-event simulation
- Accessibility testing

**Playwright** (E2E)
- End-to-end testing
- Cross-browser
- Mobile emulation

### TypeScript

**TypeScript 5+**
- Strict mode enabled
- Type-safe API contracts
- Shared types between frontend/backend

**tsconfig.json** (Frontend):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Environment Management

**dotenv**
- Environment variables
- `.env` files for different environments
- `.env.example` for documentation

---

## Deployment

### Frontend Hosting

**Vercel** (Recommended)
- Zero-config deployment
- Automatic HTTPS
- CDN included
- Preview deployments
- PWA support

**Alternative**: Netlify

### Backend Hosting

**Railway** (Recommended)
- One-click PostgreSQL
- Auto-deploy from Git
- Environment variables
- Easy scaling

**Alternatives**:
- Render
- Fly.io
- AWS Elastic Beanstalk

### Database Hosting

**Railway PostgreSQL** (Recommended for simplicity)
- Managed PostgreSQL
- Automatic backups
- Connection pooling

**Alternatives**:
- Supabase
- Neon
- AWS RDS

### CI/CD

**GitHub Actions**
- Automated testing
- Linting on PR
- Auto-deploy on merge
- Environment-specific deployments

**Workflow**:
1. Push to feature branch
2. Run tests and linting
3. Create preview deployment
4. Merge to main
5. Deploy to production

---

## Project Structure

### Frontend Structure

```
src/
├── assets/           # Static assets (images, fonts)
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Button, Card, Input)
│   ├── layout/      # Layout components (Header, Nav, Footer)
│   └── features/    # Feature-specific components
├── hooks/           # Custom React hooks
├── pages/           # Page components (route-based)
├── stores/          # Zustand stores
├── services/        # API services
├── utils/           # Utility functions
├── types/           # TypeScript types
├── constants/       # App constants
├── styles/          # Global styles
└── main.tsx         # Entry point
```

### Backend Structure

```
src/
├── controllers/     # Route handlers
├── middleware/      # Express middleware
├── routes/          # Route definitions
├── services/        # Business logic
├── models/          # Prisma models (auto-generated)
├── utils/           # Utility functions
├── types/           # TypeScript types
├── validators/      # Zod schemas
├── config/          # Configuration
└── index.ts         # Entry point
```

---

## Dependencies

### Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@tanstack/react-query": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "vite-plugin-pwa": "^0.17.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0"
  }
}
```

### Backend Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "@prisma/client": "^5.6.0",
    "zod": "^3.22.0",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/bcryptjs": "^2.4.0",
    "prisma": "^5.6.0",
    "tsx": "^4.0.0",
    "vitest": "^1.0.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0"
  }
}
```

---

## Environment Variables

### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=AA Attendance
VITE_APP_VERSION=1.0.0
```

### Backend (.env)

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/aa_attendance
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
```

---

## Security Considerations

### Authentication Security

- Password hashing with bcrypt (10 rounds minimum)
- JWT with expiration and refresh tokens
- HTTPS in production
- Secure cookie flags (HttpOnly, Secure, SameSite)

### API Security

- Rate limiting (express-rate-limit)
- CORS configuration
- Helmet.js for security headers
- Input validation with Zod
- SQL injection prevention (Prisma parameterized queries)

### Data Security

- Encrypted database connections (SSL)
- Environment variables for secrets
- No sensitive data in logs
- Regular security audits

---

## Performance Optimization

### Frontend

- Code splitting by route
- Lazy loading components
- Image optimization (WebP)
- Service worker caching
- CDN for static assets
- Minification and tree-shaking

### Backend

- Database indexing
- Query optimization
- Connection pooling
- Response compression
- Caching with Redis (optional)
- Load balancing for scale

---

## Monitoring & Logging

### Logging

**Winston** (Backend)
- Structured logging
- Log levels (error, warn, info, debug)
- File and console transports

### Error Tracking

**Sentry** (Optional)
- Frontend error tracking
- Backend error tracking
- User context
- Performance monitoring

### Analytics

**Privacy-Focused Options**:
- Plausible Analytics
- Fathom Analytics
- Self-hosted Matomo

---

## Future Considerations

### Potential Enhancements

1. **WebSocket Support**: Real-time dashboard updates
2. **Push Notifications**: Check-in reminders, admin alerts
3. **Geofencing**: Automatic location verification
4. **Face Recognition**: Optional biometric check-in
5. **Mobile Apps**: React Native for iOS/Android
6. **Integration**: Payroll system integration APIs

### Scalability Path

1. **Phase 1**: Single server (development)
2. **Phase 2**: Separate frontend/backend hosting
3. **Phase 3**: Database read replicas
4. **Phase 4**: Redis caching layer
5. **Phase 5**: Microservices for high scale

---

## Getting Started

### Prerequisites

- Node.js 20 LTS
- pnpm (or npm/yarn)
- PostgreSQL 15+
- Git

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd aa-attendance

# Install frontend dependencies
cd frontend
pnpm install

# Install backend dependencies
cd ../backend
pnpm install

# Setup database
cd backend
pnpm prisma migrate dev

# Start development
# Terminal 1 (Backend)
cd backend
pnpm dev

# Terminal 2 (Frontend)
cd frontend
pnpm dev
```

---

## References

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Prisma Documentation](https://prisma.io)
- [PostgreSQL Documentation](https://postgresql.org)
- [Material Symbols](https://fonts.google.com/icons)
- [Inter Font](https://rsms.me/inter/)
