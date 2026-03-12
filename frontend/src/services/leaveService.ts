import apiClient from './api';
import type { LeaveBalance, LeaveRequest } from '@/types';

export const leaveService = {
  async getMyBalance(year?: number): Promise<LeaveBalance> {
    const params = year ? `?year=${year}` : '';
    const response = await apiClient.get<{ success: boolean; data: LeaveBalance }>(`/leaves/my-balance${params}`);
    return response.data.data;
  },

  async createLeaveRequest(data: {
    type: string;
    startDate: string;
    endDate: string;
    reason?: string;
    days: number;
  }): Promise<LeaveRequest> {
    const response = await apiClient.post<{ success: boolean; data: LeaveRequest }>('/leaves/request', data);
    return response.data.data;
  },

  async getMyRequests(page = 1, limit = 20, status?: string): Promise<{ records: LeaveRequest[]; total: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    const response = await apiClient.get<{ success: boolean; data: LeaveRequest[]; pagination: { total: number } }>(`/leaves/my-requests?${params}`);
    return { records: response.data.data, total: response.data.pagination.total };
  },

  async getAllRequests(page = 1, limit = 20, status?: string): Promise<{ records: LeaveRequest[]; total: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    const response = await apiClient.get<{ success: boolean; data: LeaveRequest[]; pagination: { total: number } }>(`/leaves/all-requests?${params}`);
    return { records: response.data.data, total: response.data.pagination.total };
  },

  async updateRequestStatus(requestId: string, status: 'approved' | 'rejected'): Promise<LeaveRequest> {
    const response = await apiClient.put<{ success: boolean; data: LeaveRequest }>(`/leaves/request/${requestId}/status`, { status });
    return response.data.data;
  },

  async updateLeaveBalance(userId: string, year: number, sickLeaveTotal?: number, annualLeaveTotal?: number): Promise<LeaveBalance> {
    const response = await apiClient.put<{ success: boolean; data: LeaveBalance }>(`/leaves/balance/${userId}`, {
      year,
      sickLeaveTotal,
      annualLeaveTotal,
    });
    return response.data.data;
  },
};
