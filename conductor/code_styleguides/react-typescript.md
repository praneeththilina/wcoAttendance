# React & TypeScript Code Style Guide

## Overview

This style guide defines coding standards for React components and TypeScript development in the AA Attendance project.

---

## TypeScript Guidelines

### 1. Type Definitions

**Use interfaces for object shapes:**
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'admin' | 'manager' | 'hr';
  isActive: boolean;
}
```

**Use type aliases for unions and primitives:**
```typescript
type AttendanceStatus = 'checked_in' | 'checked_out' | 'incomplete';
type UserRole = 'employee' | 'admin' | 'manager' | 'hr';
```

**Avoid `any` type:**
```typescript
// ❌ Bad
const data: any = fetchData();

// ✅ Good
const data: AttendanceRecord = fetchData();
```

### 2. Type Safety

**Use strict mode in tsconfig.json:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Define return types for functions:**
```typescript
// ✅ Good
function calculateTotalHours(checkIn: Date, checkOut: Date): number {
  return (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
}
```

### 3. Generics

**Use generics for reusable functions:**
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  // ...
}
```

---

## React Guidelines

### 1. Component Structure

**Use functional components with hooks:**
```typescript
// ✅ Good
interface CheckInButtonProps {
  clientId: string;
  onCheckIn: (clientId: string) => void;
  disabled?: boolean;
}

export function CheckInButton({ clientId, onCheckIn, disabled }: CheckInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onCheckIn(clientId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={disabled || isLoading}>
      {isLoading ? 'Checking In...' : 'Check In'}
    </button>
  );
}
```

### 2. Props Naming

**Use clear, descriptive prop names:**
```typescript
// ✅ Good
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// ❌ Bad
interface ButtonProps {
  type?: string;
  s?: string;
  loading?: boolean;
  fn?: () => void;
  text?: React.ReactNode;
}
```

### 3. Event Handlers

**Name event handlers clearly:**
```typescript
// ✅ Good
interface Props {
  onSubmit?: (data: FormData) => void;
  onChange?: (value: string) => void;
  onClick?: () => void;
}

// Use 'on' prefix for callback props
const handleSubmit = (event: FormEvent) => {
  event.preventDefault();
  onSubmit?.(formData);
};
```

### 4. Hooks

**Custom hooks should start with 'use':**
```typescript
// ✅ Good
function useAttendance() {
  const [status, setStatus] = useState<AttendanceStatus | null>(null);

  const checkIn = async (clientId: string) => {
    // ...
  };

  const checkOut = async () => {
    // ...
  };

  return { status, checkIn, checkOut };
}
```

**Follow Rules of Hooks:**
- Only call hooks at the top level
- Only call hooks from React functions
- Use ESLint plugin `eslint-plugin-react-hooks`

### 5. State Management

**Use useState for local state:**
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);
```

**Use useReducer for complex state:**
```typescript
interface AttendanceState {
  status: AttendanceStatus | null;
  checkInTime: Date | null;
  clientId: string | null;
}

type AttendanceAction =
  | { type: 'CHECK_IN'; payload: { time: Date; clientId: string } }
  | { type: 'CHECK_OUT'; payload: { time: Date } }
  | { type: 'RESET' };

function attendanceReducer(state: AttendanceState, action: AttendanceAction): AttendanceState {
  switch (action.type) {
    case 'CHECK_IN':
      return {
        ...state,
        status: 'checked_in',
        checkInTime: action.payload.time,
        clientId: action.payload.clientId,
      };
    case 'CHECK_OUT':
      return {
        ...state,
        status: 'checked_out',
        checkOutTime: action.payload.time,
      };
    case 'RESET':
      return {
        status: null,
        checkInTime: null,
        clientId: null,
      };
    default:
      return state;
  }
}
```

**Use Zustand for global state:**
```typescript
import { create } from 'zustand';

interface AttendanceStore {
  status: AttendanceStatus | null;
  checkInTime: Date | null;
  clientId: string | null;
  setCheckedIn: (clientId: string, time: Date) => void;
  setCheckedOut: (time: Date) => void;
  reset: () => void;
}

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  status: null,
  checkInTime: null,
  clientId: null,
  setCheckedIn: (clientId, time) =>
    set({ status: 'checked_in', clientId, checkInTime: time }),
  setCheckedOut: (time) => set({ status: 'checked_out', checkOutTime: time }),
  reset: () => set({ status: null, clientId: null, checkInTime: null }),
}));
```

---

## File Organization

### 1. Component File Structure

```
src/
├── components/
│   ├── ui/              # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── index.ts     # Barrel exports
│   ├── layout/          # Layout components
│   │   ├── Header.tsx
│   │   ├── BottomNav.tsx
│   │   └── index.ts
│   └── features/        # Feature-specific components
│       ├── attendance/
│       │   ├── CheckInButton.tsx
│       │   ├── CheckOutButton.tsx
│       │   └── AttendanceStatus.tsx
│       └── clients/
│           ├── ClientList.tsx
│           ├── ClientSearch.tsx
│           └── ClientCard.tsx
├── pages/               # Page components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   └── AttendanceHistory.tsx
├── hooks/               # Custom hooks
│   ├── useAttendance.ts
│   ├── useAuth.ts
│   └── useGeolocation.ts
├── services/            # API services
│   ├── api.ts
│   ├── attendance.ts
│   └── auth.ts
├── stores/              # Zustand stores
│   ├── attendanceStore.ts
│   └── authStore.ts
├── types/               # TypeScript types
│   ├── user.ts
│   ├── attendance.ts
│   └── client.ts
└── utils/               # Utility functions
    ├── formatTime.ts
    └── calculateHours.ts
```

### 2. File Naming

**Use PascalCase for components:**
```
CheckInButton.tsx    ✅
checkInButton.tsx    ❌
```

**Use camelCase for utilities and hooks:**
```
useAttendance.ts     ✅
formatTime.ts        ✅
```

### 3. Exports

**Use named exports for components:**
```typescript
// ✅ Good
export function Button({ children, onClick }: ButtonProps) {
  // ...
}

export function Input({ value, onChange }: InputProps) {
  // ...
}

// ❌ Avoid default exports
```

**Use barrel exports for modules:**
```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
```

---

## Code Formatting

### 1. Import Order

```typescript
// 1. React
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import axios from 'axios';
import { format } from 'date-fns';

// 3. Internal modules (absolute imports)
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

// 4. Relative imports
import { ClientCard } from './ClientCard';
import { formatDate } from '../../utils/formatTime';

// 5. Styles
import './Dashboard.css';
```

### 2. Component Structure

```typescript
// 1. Imports

// 2. Types/Interfaces
interface DashboardProps {
  userId: string;
}

// 3. Component
export function Dashboard({ userId }: DashboardProps) {
  // 4. Hooks
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // 5. Event handlers
  const handleRefresh = async () => {
    // ...
  };

  // 6. Effects
  useEffect(() => {
    // ...
  }, []);

  // 7. Render
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard">
      {/* Content */}
    </div>
  );
}
```

### 3. JSX Formatting

**Use parentheses for multi-line JSX:**
```typescript
// ✅ Good
return (
  <div className="container">
    <Header />
    <Main />
  </div>
);

// ❌ Bad
return <div className="container">
  <Header />
  <Main />
</div>;
```

**Self-close elements with no children:**
```typescript
// ✅ Good
<Input value={value} onChange={handleChange} />

// ❌ Bad
<Input value={value} onChange={handleChange}></Input>
```

---

## Best Practices

### 1. Error Handling

**Use try-catch with proper error handling:**
```typescript
async function handleCheckIn(clientId: string) {
  try {
    setIsLoading(true);
    await attendanceService.checkIn(clientId);
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('An unexpected error occurred');
    }
  } finally {
    setIsLoading(false);
  }
}
```

### 2. Loading States

**Always show loading states for async operations:**
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await api.submit(data);
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Accessibility

**Use semantic HTML and ARIA attributes:**
```typescript
// ✅ Good
<button
  onClick={handleClick}
  disabled={isLoading}
  aria-label="Check in to work"
  aria-busy={isLoading}
>
  {isLoading ? 'Checking In...' : 'Check In'}
</button>

// Use proper heading hierarchy
<h1>Dashboard</h1>
<h2>Today's Attendance</h2>
```

### 4. Performance

**Use React.memo for expensive components:**
```typescript
export const ClientList = memo(function ClientList({ clients }: ClientListProps) {
  return (
    <ul>
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </ul>
  );
});
```

**Use useCallback for stable function references:**
```typescript
const handleClick = useCallback(() => {
  onCheckIn(clientId);
}, [clientId, onCheckIn]);
```

**Use useMemo for expensive calculations:**
```typescript
const totalHours = useMemo(() => {
  return calculateTotalHours(checkInTime, checkOutTime);
}, [checkInTime, checkOutTime]);
```

---

## Testing Guidelines

### 1. Unit Tests

**Test components with React Testing Library:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckInButton } from './CheckInButton';

describe('CheckInButton', () => {
  it('renders with default text', () => {
    render(<CheckInButton clientId="123" onCheckIn={vi.fn()} />);
    expect(screen.getByText('Check In')).toBeInTheDocument();
  });

  it('calls onCheckIn when clicked', async () => {
    const onCheckIn = vi.fn();
    render(<CheckInButton clientId="123" onCheckIn={onCheckIn} />);
    
    fireEvent.click(screen.getByText('Check In'));
    
    await waitFor(() => {
      expect(onCheckIn).toHaveBeenCalledWith('123');
    });
  });

  it('shows loading state when loading', () => {
    render(<CheckInButton clientId="123" onCheckIn={vi.fn()} isLoading />);
    expect(screen.getByText('Checking In...')).toBeInTheDocument();
  });
});
```

### 2. Test Coverage

**Aim for >80% code coverage:**
- Components: Test rendering, interactions, edge cases
- Hooks: Test all returned functions and state changes
- Utilities: Test all input combinations
- Services: Mock API calls, test error handling

---

## Code Review Checklist

Before submitting code for review:

- [ ] TypeScript types are defined for all props, state, and function signatures
- [ ] No `any` types used
- [ ] Components are functional and use hooks
- [ ] Event handlers are properly typed
- [ ] Loading and error states are handled
- [ ] Accessibility attributes are included
- [ ] Tests are written for new functionality
- [ ] Code follows formatting guidelines
- [ ] Imports are organized correctly
- [ ] No console.log statements in production code
- [ ] Component is exported from appropriate index.ts
