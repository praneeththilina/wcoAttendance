import apiClient from './api';
import type { LoginRequest, LoginResponse, Client, AttendanceRecord, AttendanceStatus } from '@/types';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/refresh', { refreshToken });
    return response.data;
  },
};

export const attendanceService = {
  async getTodayStatus(): Promise<AttendanceStatus> {
    const response = await apiClient.get<{ success: boolean; data: { status: string; attendance: any } }>('/attendance/today');
    const { status: attendanceStatus, attendance } = response.data.data;
    return {
      status: attendanceStatus as 'checked_in' | 'checked_out' | 'incomplete',
      checkInTime: attendance?.checkInTime || null,
      checkOutTime: attendance?.checkOutTime || null,
      clientId: attendance?.clientId || null,
      clientName: attendance?.client?.name || null,
      totalHours: attendance?.totalHours || null,
    };
  },

  async checkIn(clientId: string, location: { latitude: number; longitude: number; accuracy?: number }): Promise<AttendanceRecord> {
    const response = await apiClient.post<{ success: boolean; data: AttendanceRecord }>('/attendance/check-in', {
      clientId,
      location,
    });
    return response.data.data;
  },

  async checkOut(location?: { latitude: number; longitude: number; accuracy?: number }): Promise<AttendanceRecord> {
    const response = await apiClient.post<{ success: boolean; data: AttendanceRecord }>('/attendance/check-out', {
      location,
    });
    return response.data.data;
  },

  async changeLocation(clientId: string, location: { latitude: number; longitude: number; accuracy?: number }): Promise<AttendanceRecord> {
    const response = await apiClient.post<{ success: boolean; data: AttendanceRecord }>('/attendance/change-location', {
      clientId,
      location,
    });
    return response.data.data;
  },

  async getHistory(page = 1, limit = 20, startDate?: string, endDate?: string): Promise<{ records: AttendanceRecord[]; total: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get<{ success: boolean; data: AttendanceRecord[]; pagination: { total: number } }>(`/attendance/history?${params}`);
    return { records: response.data.data, total: response.data.pagination?.total || 0 };
  },
};

export const clientService = {
  async getAll(): Promise<Client[]> {
    const response = await apiClient.get<{ success: boolean; data: Client[] }>('/clients');
    return response.data.data;
  },

  async getRecent(limit = 5): Promise<Client[]> {
    const response = await apiClient.get<{ success: boolean; data: Client[] }>(`/clients/recent?limit=${limit}`);
    return response.data.data;
  },

  async search(query: string): Promise<Client[]> {
    const response = await apiClient.get<{ success: boolean; data: Client[] }>(`/clients/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },
};
