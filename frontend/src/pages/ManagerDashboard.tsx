import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants';
import apiClient from '@/services/api';

interface DashboardStats {
  totalPresent: number;
  todaysAttendance: any[];
}

export function ManagerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/manager/dashboard');
      setStats(response.data.data);
    } catch (error: any) {
      console.error('Failed to load manager dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 pb-20">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Manager Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome, {user?.firstName}</p>
        </div>
        <button
          onClick={() => {
            logout();
            navigate(ROUTES.LOGIN);
          }}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full bg-slate-100 dark:bg-slate-800"
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Team Active Today</p>
              <h2 className="text-3xl font-bold text-primary">
                {isLoading ? '-' : stats?.totalPresent || 0}
              </h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined max-text-3xl">groups</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-bold text-lg">Today's Team Attendance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 font-medium">Employee</th>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 font-medium">Check In</th>
                  <th className="px-6 py-3 font-medium">Check Out</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
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
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                        {record.user.firstName} {record.user.lastName}{' '}
                        <span className="text-xs text-slate-500 block">
                          {record.user.employeeId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {record.client?.name || 'Unknown'}{' '}
                        <span className="text-xs text-slate-500 block">
                          {record.client?.city || ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {new Date(record.checkInTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {record.checkOutTime
                          ? new Date(record.checkOutTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            record.status === 'checked_in'
                              ? 'bg-success/10 text-success'
                              : record.status === 'checked_out'
                                ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                                : 'bg-warning/10 text-warning'
                          }`}
                        >
                          {record.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm mt-8">
          <div className="p-6">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate(ROUTES.ADMIN_LEAVES)}
                className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all text-left group"
              >
                <div className="bg-primary/10 p-3 rounded-full text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">event_note</span>
                </div>
                <div>
                  <h4 className="font-bold">Manage Leaves</h4>
                  <p className="text-xs text-slate-500">Review and approve team leaves</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
