# Track Specification: Core Employee Attendance Flow

## Overview

This track delivers the MVP foundation for the AA Attendance system, enabling external auditors to authenticate, check-in at client locations, and check-out at the end of their work day.

---

## Goals

1. **Secure Authentication** - Email/employee ID based login with JWT tokens
2. **Fast Check-In** - Two-tap check-in with GPS location capture
3. **Clear Status Display** - Real-time attendance status on dashboard
4. **Simple Check-Out** - One-tap check-out with hours calculation
5. **Mobile-First UI** - Responsive design optimized for outdoor use

---

## User Stories

### US-1: User Login
**As an** employee  
**I want to** log in with my email and password  
**So that** I can access my attendance features securely

**Acceptance Criteria:**
- Login form with email and password fields
- Validation for email format and password length
- "Remember me" option for persistent sessions
- Error messages for invalid credentials
- Redirect to dashboard on successful login

### US-2: View Dashboard
**As an** employee  
**I want to** see my current attendance status  
**So that** I know if I'm checked in or out

**Acceptance Criteria:**
- Display employee name and date
- Show current status (Not Checked In / Checked In)
- Display check-in time if checked in
- Show current client location if checked in
- Quick action buttons based on status

### US-3: Check In
**As an** employee  
**I want to** check in when I arrive at a client location  
**So that** my attendance is recorded

**Acceptance Criteria:**
- Large "Check In" button on dashboard
- Client selection with search
- GPS location capture (with permission)
- Confirmation screen after check-in
- Status updates immediately
- Works offline with sync when online

### US-4: Check Out
**As an** employee  
**I want to** check out at the end of my work day  
**So that** my work hours are recorded

**Acceptance Criteria:**
- Large "Check Out" button on dashboard
- Confirmation before checking out
- Display total hours worked
- GPS location capture (optional)
- Status updates to "Not Checked In"

### US-5: Client Selection
**As an** employee  
**I want to** search and select my client  
**So that** my work location is accurately recorded

**Acceptance Criteria:**
- Search bar for client name
- Scrollable client list
- Recent clients section
- Client name and city displayed
- One-tap selection

---

## Technical Requirements

### Frontend

**Components:**
- `LoginPage` - Login form with validation
- `Dashboard` - Main employee dashboard
- `CheckInButton` - Large primary action button
- `CheckOutButton` - Large primary action button
- `ClientSelector` - Search and select client
- `AttendanceStatus` - Status badge and info display
- `BottomNav` - Navigation bar

**State Management:**
- Zustand store for attendance state
- Persist middleware for offline support
- Auth store for user session

**API Integration:**
- Axios with interceptors for auth tokens
- React Query for server state
- Error handling and retries

### Backend

**API Endpoints:**
```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/attendance/today
POST   /api/v1/attendance/check-in
POST   /api/v1/attendance/check-out
GET    /api/v1/clients
```

**Database Models:**
- User (employee accounts)
- Client (client locations)
- AttendanceRecord (check-in/out records)

**Security:**
- JWT authentication
- Password hashing with bcrypt
- Role-based access control

### Database

**Tables:**
- `users` - Employee accounts
- `clients` - Client locations with GPS coordinates
- `attendance_records` - Check-in/out records with timestamps and locations

---

## Design Requirements

### Visual Design

**Follow Product Guidelines:**
- Primary color: #2c1a4c (deep purple)
- Font: Inter (Google Fonts)
- Icons: Material Symbols
- Button height: 80px for primary actions
- Touch targets: minimum 40px

### UX Principles

**"Two Taps, Three Seconds, Done":**
- Check-in: Tap dashboard → Tap client → Done
- Minimal typing (search over type)
- Clear visual feedback
- Outdoor-readable contrast

### Responsive Design

**Mobile-First:**
- Container max-width: 480px
- Bottom navigation
- Thumb-friendly layout
- Landscape support

---

## Non-Functional Requirements

### Performance

- Initial load: <2 seconds on 4G
- Check-in action: <1 second
- Offline support: Core features work without internet

### Security

- HTTPS in production
- JWT token expiration (7 days)
- Refresh token rotation
- Password hashing (bcrypt, 10 rounds)

### Accessibility

- WCAG AA compliance
- Minimum 4.5:1 contrast ratio
- 40px minimum touch targets
- Screen reader support

### Testing

- Unit test coverage: >80%
- Component tests for all UI components
- Integration tests for API endpoints
- E2E test for check-in/check-out flow

---

## Out of Scope (Future Tracks)

- Admin dashboard and monitoring
- Change client location after check-in
- Advanced reporting and exports
- Manager analytics
- Face recognition / biometric check-in
- Push notifications
- Geofencing validation

---

## Success Metrics

### Functional

- User can log in successfully
- User can check in with client selection
- User can check out and see hours worked
- Status displays correctly in real-time

### Performance

- Check-in completes in <3 seconds
- App loads in <2 seconds on mobile
- Offline mode works correctly

### Quality

- >80% test coverage
- No critical bugs
- ESLint and TypeScript pass
- Accessibility audit passes

---

## Dependencies

### External

- PostgreSQL database
- Node.js runtime (v20)
- Modern browser with geolocation support

### Internal

- Product guidelines finalized
- Tech stack approved
- Development environment set up

---

## Risks and Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| GPS permission denied | Medium | Allow manual location entry, use IP-based fallback |
| Offline sync conflicts | Medium | Last-write-wins strategy, conflict resolution UI |
| Token expiration during work | Low | Silent refresh with refresh tokens |
| Database connection issues | High | Connection pooling, retry logic, error monitoring |

---

## Acceptance Criteria

This track is complete when:

- [ ] All user stories are implemented and tested
- [ ] API endpoints are documented and functional
- [ ] Database schema is migrated and seeded
- [ ] Frontend UI matches product guidelines
- [ ] Test coverage exceeds 80%
- [ ] E2E flow (login → check-in → check-out) works
- [ ] Deployed to staging environment
- [ ] User acceptance testing passed
