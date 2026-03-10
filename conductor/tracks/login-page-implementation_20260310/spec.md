# Track Specification: Login Page Implementation

## Overview

This track delivers the complete login page implementation for the AA Attendance system, following the approved UI/UX mockups from the `ux_ui/employee_login_1` and `ux_ui/employee_login_2` folders.

---

## Goals

1. **Professional Login UI** - Clean, corporate design matching the mockups
2. **Secure Authentication** - Email-based login with JWT tokens
3. **Excellent UX** - Fast, intuitive, accessible login experience
4. **Dark Mode Support** - Full theme switching capability
5. **Mobile-First** - Optimized for mobile devices used by field auditors

---

## User Stories

### US-1: Employee Login
**As an** employee  
**I want to** log in with my email address and password  
**So that** I can access the attendance system securely

**Acceptance Criteria:**
- Login form with email and password fields
- Email format validation
- Password minimum 8 characters validation
- Account lockout after 5 failed attempts
- Error messages for invalid credentials
- Redirect to role-appropriate dashboard on success

### US-2: Remember Me
**As an** employee  
**I want to** stay logged in across browser sessions  
**So that** I don't have to login every time I use the app

**Acceptance Criteria:**
- "Remember me" checkbox on login form
- Session persists for 30 days when checked
- Session expires after 7 days when unchecked
- Sliding session extends with user activity

### US-3: Password Visibility Toggle
**As an** user  
**I want to** toggle password visibility  
**So that** I can verify I've entered the correct password

**Acceptance Criteria:**
- Eye icon in password field
- Click toggles between password and text type
- Icon changes based on visibility state

### US-4: Forgot Password
**As an** employee  
**I want to** reset my password if I forget it  
**So that** I can regain access to my account

**Acceptance Criteria:**
- "Forgot password?" link on login form
- Navigates to password reset page (future track)

### US-5: Dark Mode
**As an** user  
**I want to** use the app in dark mode  
**So that** I can reduce eye strain in low-light conditions

**Acceptance Criteria:**
- System preference detection
- Manual theme toggle (future enhancement)
- All components styled for both themes

---

## Functional Requirements

### Authentication
1. **Email-based login**
   - Input: Email address (required)
   - Input: Password (required, min 8 characters)
   - Validation: Email format (RFC 5322)
   - Validation: Password length (min 8 chars)
   - Account lockout after 5 failed attempts (15-minute cooldown)

2. **Session Management**
   - JWT token generation on successful login
   - Access token expiration: 7 days
   - Refresh token expiration: 30 days (with "Remember me")
   - Sliding session: Token refreshes with activity
   - Secure token storage (httpOnly cookies recommended)

3. **Role-Based Redirect**
   - Employees → Employee Dashboard
   - Admins → Admin Dashboard
   - Managers → Manager Dashboard
   - HR → HR Dashboard

4. **Error Handling**
   - Invalid email format: "Please enter a valid email address"
   - Invalid credentials: "Invalid email or password"
   - Account locked: "Too many failed attempts. Please try again in 15 minutes"
   - Network error: "Connection failed. Please check your internet"
   - Server error: "Service temporarily unavailable"

### UI Components

5. **Login Page Layout** (from mockups)
   - Top App Bar:
     - Back arrow icon (navigation)
     - "Attendance Tracker" title (centered)
   
   - Hero Section:
     - Corporate building background image
     - Purple overlay (#2c1a4c with 40% opacity)
     - Logo container: White rounded card with domain_verification icon
   
   - Welcome Section:
     - "Welcome back" heading (32px, bold)
     - "Professional Audit Firm Attendance Portal" subtitle
   
   - Login Form:
     - Email input with person icon (left)
     - Password input with lock icon (left) and visibility toggle (right)
     - "Remember me" checkbox
     - "Forgot password?" link
     - "Sign In" button (full-width, 80px height, primary color)
   
   - Footer:
     - "Need help? Contact IT Support" link
     - Pagination dots (decorative)

6. **Styling Requirements**
   - Primary color: #2c1a4c (deep purple)
   - Background light: #f7f6f8
   - Background dark: #18141e
   - Font: Inter (Google Fonts)
   - Icons: Material Symbols Outlined
   - Input height: 56px (h-14)
   - Button height: 80px for primary action
   - Border radius: 0.5rem (lg) for inputs, buttons
   - Shadow: shadow-lg for button, shadow-md for cards

7. **Dark Mode**
   - Full theme support for all elements
   - Text colors: slate-900 (light) → slate-100 (dark)
   - Borders: slate-200 (light) → slate-800 (dark)
   - Inputs: white (light) → slate-900 (dark)
   - System preference detection

8. **Loading States**
   - Button shows spinner during authentication
   - Button disabled while loading
   - Button text changes to "Signing In..."
   - Active scale effect: active:scale-[0.98]

9. **Validation Feedback**
   - Real-time email format validation
   - Inline error messages below fields
   - Red border on invalid fields
   - Error shake animation (optional)

---

## Non-Functional Requirements

### Performance
- Initial page load: <2 seconds on 4G
- Login response: <1 second (excluding network)
- Smooth animations: 60fps

### Security
- HTTPS in production
- Password hashing: bcrypt (10 rounds)
- JWT with expiration and refresh
- Rate limiting: 5 attempts per 15 minutes
- CSRF protection
- XSS prevention

### Accessibility
- WCAG AA compliance
- Keyboard navigation support
- Focus states on all interactive elements
- Screen reader labels
- Minimum 4.5:1 contrast ratio
- Touch targets: minimum 40px

### Testing
- Unit test coverage: >80%
- Component tests for LoginPage
- Integration tests for auth flow
- E2E test: Login → Dashboard redirect
- Accessibility audit

---

## Technical Implementation

### Frontend Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Validation**: Zod schema
- **State Management**: Zustand (auth store)
- **HTTP Client**: Axios
- **Icons**: Material Symbols (Google Fonts)
- **Font**: Inter (Google Fonts)

### Backend Integration
- **Endpoint**: POST /api/v1/auth/login
- **Request**: `{ email: string, password: string, rememberMe: boolean }`
- **Response**: `{ success: boolean, data: { user: User, accessToken: string, refreshToken: string }, message: string }`
- **Error Response**: `{ success: false, error: { code: string, message: string } }`

### Project Structure
```
src/
├── pages/
│   └── Login.tsx
├── components/
│   └── features/
│       └── auth/
│           ├── LoginForm.tsx
│           ├── EmailInput.tsx
│           ├── PasswordInput.tsx
│           └── RememberMeCheckbox.tsx
├── hooks/
│   └── useAuth.ts
├── stores/
│   └── authStore.ts
├── services/
│   └── auth.ts
├── validators/
│   └── auth.validator.ts
└── types/
    └── auth.ts
```

---

## Out of Scope (Future Tracks)

- Social login (Google, Microsoft)
- Biometric authentication (fingerprint, face ID)
- Two-factor authentication (2FA)
- SSO integration
- Complete forgot password flow
- Account registration/signup
- Multi-language support

---

## Dependencies

### External
- Backend authentication API
- PostgreSQL database with users table
- Material Symbols font
- Inter font

### Internal
- Product guidelines (visual identity)
- Tech stack (React + TypeScript + Tailwind)
- Workflow (TDD, >80% test coverage)

---

## UI Reference

**Mockup Files:**
- `ux_ui/employee_login_1/code.html` - Primary login screen design
- `ux_ui/employee_login_2/code.html` - Alternative login screen design
- `ux_ui/employee_login_1/screen.png` - Visual reference
- `ux_ui/employee_login_2/screen.png` - Visual reference

**Key Design Elements:**
- Corporate hero image with purple overlay
- Domain verification icon in white card
- "Welcome back" centered heading
- Email and password inputs with icons
- Remember me + Forgot password row
- Large primary "Sign In" button
- Help text and pagination dots at bottom

---

## Acceptance Criteria

This track is complete when:

- [ ] Login page matches the UI mockups
- [ ] Email validation works correctly
- [ ] Password validation (min 8 chars) works
- [ ] Remember me functionality persists session
- [ ] Password visibility toggle works
- [ ] Forgot password link navigates (placeholder)
- [ ] Loading state displays during authentication
- [ ] Error messages display correctly
- [ ] Dark mode fully supported
- [ ] Role-based redirect works (employee/admin/manager/HR)
- [ ] All tests pass with >80% coverage
- [ ] Accessibility audit passes
- [ ] Code review completed
- [ ] Deployed to staging
