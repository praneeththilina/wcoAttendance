import { useState, useEffect } from 'react';

import { AdminSidebar } from '@/components/layout';

import apiClient from '@/services/api';

interface DashboardStats {
  totalEmployees: number;
  activeToday: number;
  complianceRate: number;
  todaysAttendance: {
    id: string;
    user: { firstName: string; lastName: string; employeeId: string };
    client?: { name: string; city: string };
    checkInTime: string;
    status: string;
  }[];
}

export function HRDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/hr/dashboard');
      setStats(response.data.data);
    } catch (error: unknown) {
      console.error('Failed to load HR dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between">
          <div className="relative w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
              placeholder="Search employees, records, or files..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>
            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all">
              <span className="material-symbols-outlined text-sm">add</span>
              New Hire
            </button>
          </div>
        </header>
        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Dashboard Overview
            </h2>
            <p className="text-slate-500 mt-1">
              Welcome back, Admin. Here is what's happening across the firm today.
            </p>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg material-symbols-outlined">
                  person
                </span>
                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  +2.4%
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">Total Employees</p>
              <p className="text-3xl font-bold mt-1">
                {isLoading ? '-' : stats?.totalEmployees || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-lg material-symbols-outlined">
                  event_available
                </span>
                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  +5.1%
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">Active Today</p>
              <p className="text-3xl font-bold mt-1">{isLoading ? '-' : stats?.activeToday || 0}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg material-symbols-outlined">
                  verified
                </span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                  Stable
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">Compliance Rate</p>
              <p className="text-3xl font-bold mt-1">98%</p>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Attendance Table */}
            <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-lg">Today's Firm Attendance</h3>
                <button className="text-sm text-primary font-semibold hover:underline">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                        Location
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                        Check In
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          Loading data...
                        </td>
                      </tr>
                    ) : !stats?.todaysAttendance?.length ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          No attendance records for today.
                        </td>
                      </tr>
                    ) : (
                      stats.todaysAttendance.map((record) => (
                        <tr
                          key={record.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center font-bold text-slate-500">
                                {record.user.firstName[0]}
                                {record.user.lastName[0]}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {record.user.firstName} {record.user.lastName}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {record.user.employeeId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900 dark:text-slate-100">
                              {record.client?.name || 'Unknown'}
                            </div>
                            <div className="text-xs text-slate-500">
                              {record.client?.city || ''}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {new Date(record.checkInTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${
                                record.status === 'checked_in'
                                  ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20'
                                  : record.status === 'checked_out'
                                    ? 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  record.status === 'checked_in'
                                    ? 'bg-green-500'
                                    : record.status === 'checked_out'
                                      ? 'bg-slate-500'
                                      : 'bg-amber-500'
                                }`}
                              ></span>
                              {record.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-primary hover:text-primary/80 transition-colors">
                              <span className="material-symbols-outlined text-xl">more_vert</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Quick Actions Panel */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-lg mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 hover:bg-primary/10 transition-colors group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">
                        account_balance_wallet
                      </span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Export Payroll Data
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">
                      chevron_right
                    </span>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-500">history_edu</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Audit Trail Logs
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">
                      chevron_right
                    </span>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-500">
                        holiday_village
                      </span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Manage Leaves
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
              {/* Activity Summary */}
              <div className="bg-primary p-6 rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-white font-bold text-lg mb-2">Hiring Sprint</h4>
                  <p className="text-blue-100 text-sm mb-4">
                    You have 12 interviews scheduled for this week. Keep up the pace!
                  </p>
                  <button className="bg-white text-primary px-4 py-2 rounded-lg text-xs font-bold shadow-sm">
                    Review Calendar
                  </button>
                </div>
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-white/10 select-none pointer-events-none">
                  groups
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
