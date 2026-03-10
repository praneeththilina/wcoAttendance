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
    const response = await apiClient.get<AttendanceStatus>('/attendance/today');
    return response.data;
  },

  async checkIn(clientId: string, location: { latitude: number; longitude: number; accuracy?: number }): Promise<AttendanceRecord> {
    const response = await apiClient.post<AttendanceRecord>('/attendance/check-in', {
      clientId,
      location,
    });
    return response.data;
  },

  async checkOut(location?: { latitude: number; longitude: number; accuracy?: number }): Promise<AttendanceRecord> {
    const response = await apiClient.post<AttendanceRecord>('/attendance/check-out', {
      location,
    });
    return response.data;
  },

  async getHistory(page = 1, limit = 20, startDate?: string, endDate?: string): Promise<{ records: AttendanceRecord[]; total: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get<{ records: AttendanceRecord[]; total: number }>(`/attendance/history?${params}`);
    return response.data;
  },
};

export const clientService = {
  async getAll(): Promise<Client[]> {
    const response = await apiClient.get<Client[]>('/clients');
    return response.data;
  },

  async getRecent(limit = 5): Promise<Client[]> {
    const response = await apiClient.get<Client[]>(`/clients/recent?limit=${limit}`);
    return response.data;
  },

  async search(query: string): Promise<Client[]> {
    const response = await apiClient.get<Client[]>(`/clients/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};
