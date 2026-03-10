export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ATTENDANCE_HISTORY: '/attendance',
  CLIENTS: '/clients',
  PROFILE: '/profile',
  ADMIN_DASHBOARD: '/admin/dashboard',
  MANAGER_DASHBOARD: '/manager/dashboard',
  HR_DASHBOARD: '/hr/dashboard',
} as const;

export const ROLES = {
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
  MANAGER: 'manager',
  HR: 'hr',
} as const;

export const ATTENDANCE_STATUS = {
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
  INCOMPLETE: 'incomplete',
} as const;

export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  THEME: 'theme',
  OFFLINE_QUEUE: 'offline-queue',
} as const;
