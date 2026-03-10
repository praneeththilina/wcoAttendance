# AA Attendance Frontend

Professional audit firm attendance tracking system - Frontend Application

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **React Hook Form** - Form handling
- **Zod** - Validation
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

## Getting Started

### Prerequisites

- Node.js 20 LTS
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

```bash
# Development
pnpm dev              # Start development server

# Build
pnpm build            # Build for production
pnpm preview          # Preview production build

# Testing
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Run tests with coverage
pnpm test:changed     # Run tests for changed files

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm type-check       # TypeScript type check
```

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # React components
│   ├── ui/          # Base UI components (Button, Input, Checkbox)
│   ├── layout/      # Layout components (Header, Nav, Footer)
│   └── features/    # Feature-specific components
├── constants/        # App constants
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # API services
├── stores/          # Zustand stores
├── styles/          # Global styles
├── test/            # Test utilities and setup
├── types/           # TypeScript types
├── utils/           # Utility functions
├── validators/      # Zod schemas
├── App.tsx          # Root component
└── main.tsx         # Entry point
```

## Key Features

- **Email-based authentication** with JWT tokens
- **Remember me** functionality with persistent sessions
- **Role-based access control** (Employee, Admin, Manager, HR)
- **Dark mode** support with system preference detection
- **Mobile-first** responsive design
- **PWA support** for offline functionality
- **Form validation** with Zod schemas
- **Accessible** components (WCAG AA compliant)

## Design System

### Colors

- **Primary**: `#2c1a4c` (Deep purple)
- **Primary Light**: `#3d2469`
- **Background Light**: `#f7f6f8`
- **Background Dark**: `#18141e`
- **Success**: `#10b981`
- **Warning**: `#f59e0b`
- **Error**: `#ef4444`
- **Info**: `#3b82f6`

### Typography

- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Icons

- Material Symbols Outlined (Google Fonts)

## Testing

Tests are written using Vitest and React Testing Library.

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test Button.test.tsx
```

### Test Coverage Requirement

All new code must have **>80% test coverage**.

## Code Quality

### ESLint Rules

- TypeScript strict mode
- No `any` types
- Explicit function return types (warn)

### Prettier Configuration

- Single quotes
- 2 space tabs
- 100 character print width
- Trailing commas (ES5)

## Deployment

### Production Build

```bash
pnpm build
```

Output will be in the `dist/` directory.

### Environment Variables

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## PWA Features

- Offline support with service workers
- Add to home screen
- Automatic updates
- API response caching

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari (latest)
- Chrome Android (latest)

## License

Internal use only - Audit Firm Attendance System
