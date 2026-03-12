export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ATTENDANCE_HISTORY: '/attendance',
  CLIENTS: '/clients',
  PROFILE: '/profile',
  CLIENT_SELECTION: '/clients/select',
  CHECKIN_CONFIRMATION: '/checkin/confirmation',
  CHECKOUT: '/checkout',
  CHANGE_CLIENT: '/client/change',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_STAFF: '/admin/staff',
  ADMIN_CLIENTS: '/admin/clients',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_LEAVES: '/admin/leaves',
  ADMIN_SETTINGS: '/admin/settings',
  MANAGER_DASHBOARD: '/manager/dashboard',
  HR_DASHBOARD: '/hr/dashboard',
  LEAVES: '/leaves',
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
