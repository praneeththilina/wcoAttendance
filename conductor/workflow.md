# Project Workflow

## Overview

This document defines the development workflow for the AA Attendance project. It includes coding standards, testing requirements, version control practices, and deployment procedures.

---

## Development Principles

### 1. Test-Driven Development (TDD)

**Red-Green-Refactor Cycle:**
1. **Red**: Write a failing test first
2. **Green**: Write minimal code to pass the test
3. **Refactor**: Improve code quality while keeping tests green

**Test Coverage Requirement: >80%**

All new code must have:
- Unit tests for utility functions and services
- Component tests for React components
- Integration tests for API endpoints
- E2E tests for critical user flows

### 2. Code Quality

**Standards:**
- TypeScript strict mode enabled
- ESLint rules enforced
- Prettier formatting applied
- No `any` types allowed
- All functions must have return type annotations

### 3. Small, Incremental Changes

**Best Practices:**
- One feature/fix per branch
- Small, focused commits
- Frequent commits (at least daily)
- Clear commit messages

---

## Git Workflow

### Branch Strategy

**Main Branches:**
- `main` - Production-ready code
- `develop` - Integration branch for features

**Feature Branches:**
- Format: `feature/<description>` or `feat/<description>`
- Branch from `develop`, merge back to `develop`
- Examples:
  - `feature/user-authentication`
  - `feature/check-in-flow`
  - `feat/admin-dashboard`

**Bug Fix Branches:**
- Format: `fix/<description>`
- Branch from `develop` or `main` (for hotfixes)
- Examples:
  - `fix/login-validation`
  - `fix/check-out-timer`

**Release Branches:**
- Format: `release/v<major>.<minor>.<patch>`
- Branch from `develop` when preparing release
- Merge to both `main` and `develop`

### Commit Message Convention

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build/config changes

**Examples:**
```
feat(auth): add user login endpoint

- Implement POST /api/v1/auth/login
- Add JWT token generation
- Add password validation with bcrypt
- Add Zod schema validation

Closes #123

feat(attendance): implement check-in flow

- Add CheckInButton component
- Add geolocation capture
- Add offline support with sync
- Add loading and error states

Refs #456

fix(dashboard): resolve status display issue

- Fix attendance status not updating after check-in
- Add proper state management with Zustand

Fixes #789
```

### Git Notes for Task Summaries

**Use Git Notes to record task context:**

```bash
# Add note to commit
git notes add -m "Task: Implement check-in feature
- Created CheckInButton component
- Added geolocation capture
- Implemented offline sync
- Tests: 95% coverage"

# View notes
git notes show

# Append to note
git notes append -m "Updated: Added error handling"
```

---

## Development Process

### 1. Task Assignment

**Before Starting:**
1. Read the task from `conductor/tracks/<track_id>/plan.md`
2. Understand the acceptance criteria
3. Create a feature branch from `develop`

### 2. Development Workflow

**For Each Task:**

```
1. Create branch:
   git checkout develop
   git pull origin develop
   git checkout -b feature/<task-name>

2. Write tests first (TDD):
   - Create test file
   - Write failing test
   - Run test to confirm failure

3. Implement feature:
   - Write minimal code to pass tests
   - Follow code style guides
   - Add TypeScript types
   - Add error handling

4. Run tests:
   - Unit tests
   - Integration tests
   - Component tests

5. Check code quality:
   npm run lint
   npm run format

6. Commit changes:
   git add .
   git commit -m "feat(scope): implement <feature>"

7. Push and create PR:
   git push -u origin feature/<task-name>
```

### 3. Code Review Process

**Before Submitting PR:**

- [ ] All tests pass
- [ ] Code coverage >80%
- [ ] ESLint passes with no errors
- [ ] Code is formatted with Prettier
- [ ] TypeScript compiles with no errors
- [ ] Commit messages follow convention
- [ ] PR description explains changes
- [ ] Screenshots added for UI changes

**PR Template:**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project guidelines
- [ ] Self-review completed
- [ ] Comments added where necessary
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
```

**Review Process:**
1. Create PR from feature branch to `develop`
2. Assign reviewer
3. Reviewer provides feedback
4. Address feedback and push updates
5. Reviewer approves
6. Merge to `develop` (squash merge preferred)
7. Delete feature branch

### 4. Integration and Deployment

**Develop Branch:**
- Auto-deployed to staging environment
- Integration testing performed
- QA verification

**Main Branch:**
- Production releases only
- Version tags required
- Deployment approval required

---

## Testing Strategy

### Test Pyramid

```
        /\
       /  \
      / E2E \      (Few, critical flows)
     /______\
    /        \
   /Integration\   (Some, key integrations)
  /______________\
 /                \
/    Unit Tests    \  (Many, fast feedback)
____________________\
```

### Unit Tests

**What to Test:**
- Utility functions
- Service layer business logic
- Custom hooks
- Validators/schemas

**Example (Vitest):**
```typescript
// utils/formatTime.test.ts
import { describe, it, expect } from 'vitest';
import { formatTime, calculateHours } from './formatTime';

describe('formatTime', () => {
  it('formats time correctly', () => {
    const date = new Date('2024-01-01T09:30:00');
    expect(formatTime(date)).toBe('09:30 AM');
  });

  it('handles midnight correctly', () => {
    const date = new Date('2024-01-01T00:00:00');
    expect(formatTime(date)).toBe('12:00 AM');
  });
});

describe('calculateHours', () => {
  it('calculates hours correctly', () => {
    const checkIn = new Date('2024-01-01T09:00:00');
    const checkOut = new Date('2024-01-01T17:00:00');
    expect(calculateHours(checkIn, checkOut)).toBe(8);
  });
});
```

### Component Tests

**What to Test:**
- Component rendering
- User interactions
- Props handling
- State changes
- Accessibility

**Example (React Testing Library):**
```typescript
// components/CheckInButton.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  it('shows loading state', () => {
    render(<CheckInButton clientId="123" onCheckIn={vi.fn()} isLoading />);
    expect(screen.getByText('Checking In...')).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<CheckInButton clientId="123" onCheckIn={vi.fn()} isLoading />);
    expect(screen.getByText('Checking In...')).toBeDisabled();
  });
});
```

### Integration Tests

**What to Test:**
- API endpoints
- Database operations
- Authentication flow
- Service layer integration

**Example (Supertest):**
```typescript
// tests/attendance.api.test.ts
import request from 'supertest';
import { app } from '../config/app';
import { prisma } from '../config/database';

describe('Attendance API', () => {
  beforeEach(async () => {
    await prisma.attendanceRecord.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/v1/attendance/check-in', () => {
    it('checks in successfully', async () => {
      // Create user
      const user = await prisma.user.create({
        data: {
          employeeId: 'EMP001',
          email: 'test@example.com',
          passwordHash: 'hashed',
          firstName: 'Test',
          lastName: 'User',
        },
      });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);

      const response = await request(app)
        .post('/api/v1/attendance/check-in')
        .set('Authorization', `Bearer ${token}`)
        .send({
          clientId: 'client-123',
          location: { latitude: 40.7128, longitude: -74.0060 },
        });

      expect(response.status).toBe(201);
      expect(response.body.data.status).toBe('checked_in');
    });
  });
});
```

### E2E Tests

**What to Test:**
- Critical user flows
- End-to-end scenarios
- Cross-browser compatibility

**Critical Flows:**
1. User login → Check-in → Check-out
2. User login → Change client location
3. Admin → View dashboard → Generate report

**Example (Playwright):**
```typescript
// tests/e2e/attendance-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Attendance Flow', () => {
  test('complete check-in to check-out flow', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Check in
    await page.click('text=Check In');
    await expect(page.locator('[data-testid="status"]')).toHaveText('Checked In');
    
    // Check out
    await page.click('text=Check Out');
    await expect(page.locator('[data-testid="status"]')).toHaveText('Not Checked In');
  });
});
```

---

## Phase Completion Verification and Checkpointing Protocol

### Purpose

Ensure each phase is complete and meets quality standards before proceeding to the next phase.

### Protocol

**At the End of Each Phase:**

1. **Code Review:**
   - All code for the phase is committed
   - PR created and reviewed
   - All feedback addressed

2. **Testing Verification:**
   - All tests for the phase pass
   - Code coverage meets >80% requirement
   - No critical bugs found

3. **Documentation:**
   - README updated if needed
   - API documentation updated
   - Component documentation added

4. **Quality Checks:**
   - ESLint passes with no errors
   - TypeScript compiles with no errors
   - Prettier formatting applied
   - No console warnings/errors

5. **Git Note:**
   ```bash
   git notes add -m "Phase <N> Completion Verification
   - All tasks completed
   - Tests: <coverage>%
   - ESLint: Pass
   - TypeScript: Pass
   - Documentation: Updated
   - Verified by: <name>
   - Date: <date>"
   ```

6. **Checkpoint Tag:**
   ```bash
   git tag -a "phase-<N>-complete" -m "Phase <N> completed on <date>"
   git push origin phase-<N>-complete
   ```

7. **User Confirmation:**
   - Present phase summary to user
   - Confirm all acceptance criteria met
   - Get approval to proceed to next phase

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run linter
        run: pnpm run lint
      
      - name: Run TypeScript check
        run: pnpm run type-check
      
      - name: Run tests
        run: pnpm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
  
  build:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build frontend
        run: pnpm run build:frontend
      
      - name: Build backend
        run: pnpm run build:backend
```

---

## Deployment

### Staging Deployment

**Trigger:** Push to `develop` branch

**Process:**
1. GitHub Actions builds and deploys
2. Frontend deployed to staging URL
3. Backend deployed to staging server
4. Database migrations run automatically
5. Smoke tests executed

### Production Deployment

**Trigger:** Merge to `main` branch

**Process:**
1. Create version tag: `git tag v1.0.0`
2. Push tag: `git push origin v1.0.0`
3. GitHub Actions builds and deploys
4. Manual approval required
5. Deploy to production
6. Run smoke tests
7. Monitor logs for errors

### Rollback Procedure

**If Production Issues:**
1. Identify the problematic commit
2. Revert: `git revert <commit-hash>`
3. Create hotfix branch if needed
4. Deploy reverted code
5. Investigate root cause
6. Fix and redeploy properly

---

## Code Quality Tools

### ESLint Configuration

```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
  },
};
```

### Prettier Configuration

```javascript
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### Husky Hooks

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm run lint
pnpm run type-check
pnpm run test:changed
```

---

## Package Scripts

### Frontend (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:changed": "vitest --changed"
  }
}
```

### Backend (package.json)

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext ts",
    "lint:fix": "eslint src --ext ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

---

## Definition of Done

A task is considered **Done** when:

- [ ] Code is implemented and functional
- [ ] All tests pass (unit, integration, component)
- [ ] Code coverage >80%
- [ ] ESLint passes with no errors
- [ ] TypeScript compiles with no errors
- [ ] Code is formatted with Prettier
- [ ] PR created and reviewed
- [ ] All feedback addressed
- [ ] Documentation updated
- [ ] Merged to `develop` branch
- [ ] Deployed to staging
- [ ] Verified on staging

---

## Communication

### Daily Standup (Optional)

**Questions:**
1. What did I do yesterday?
2. What will I do today?
3. Any blockers?

### Blocker Resolution

**If Blocked:**
1. Document the blocker in task comments
2. Notify team immediately
3. Escalate if not resolved within 2 hours
4. Move to another task if possible

---

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Notes](https://git-scm.com/docs/git-notes)
- [Test-Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)
- [React Testing Library](https://testing-library.com/react)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
