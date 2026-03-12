export interface User {
  id: string;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profilePicture?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'employee' | 'admin' | 'manager' | 'hr';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface AttendanceStatus {
  status: 'checked_in' | 'checked_out' | 'incomplete';
  checkInTime: string | null;
  checkOutTime: string | null;
  clientId: string | null;
  clientName: string | null;
  totalHours: number | null;
}

export interface Client {
  id: string;
  name: string;
  branch: string | null;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  clientId: string;
  checkInTime: string;
  checkOutTime: string | null;
  checkInLocation: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null;
  checkOutLocation: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null;
  totalHours: number | null;
  status: 'checked_in' | 'checked_out' | 'incomplete';
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LeaveBalance {
  id: string;
  userId: string;
  year: number;
  sickLeaveTotal: number;
  sickLeaveUsed: number;
  annualLeaveTotal: number;
  annualLeaveUsed: number;
  unpaidLeaveUsed: number;
  otherLeaveUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: 'sick' | 'annual' | 'unpaid' | 'other';
  startDate: string;
  endDate: string;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  days: number;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
  };
}
