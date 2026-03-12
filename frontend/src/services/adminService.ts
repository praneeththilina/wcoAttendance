import api from './api';

export interface DashboardStats {
  totalEmployees: number;
  checkedIn: number;
  atOffice: number;
  atClientSites: number;
  liveStaff: any[];
}

export interface DailyReportRecord {
  id: string;
  employeeName: string;
  role: string;
  clientName: string;
  checkInTime: string;
  checkOutTime: string;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'incomplete';
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  todayStatus: 'checked_in' | 'checked_out' | 'not_reported';
}

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/dashboard');
    return response.data.data;
  },

  getDailyReport: async (date: string): Promise<DailyReportRecord[]> => {
    const response = await api.get(`/admin/reports/daily?date=${date}`);
    return response.data.data;
  },

  getAllStaff: async (): Promise<StaffMember[]> => {
    const response = await api.get('/admin/staff');
    return response.data.data;
  },

  createStaff: async (data: any) => {
    const response = await api.post('/admin/staff', data);
    return response.data.data;
  },

  updateStaff: async (id: string, data: any) => {
    const response = await api.put(`/admin/staff/${id}`, data);
    return response.data;
  }
};
