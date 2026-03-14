import { useState, useEffect } from 'react';
import { AdminBottomNav, AdminSidebar } from '@/components/layout';
import { adminService, DailyReportRecord } from '@/services/adminService';

export function DailyAttendanceReport() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<DailyReportRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadReport();
  }, [selectedDate]);

  const loadReport = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getDailyReport(selectedDate);
      setRecords(data);
    } catch (error: any) {
      console.error('Failed to load daily report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    present: records.filter((r) => r.status === 'present').length,
    absent: records.filter((r) => r.status === 'absent').length,
    late: records.filter((r) => r.status === 'late').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            Present
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            Absent
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
            Late
          </span>
        );
      case 'incomplete':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
            Incomplete
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col relative w-full overflow-x-hidden md:max-w-[calc(100vw-256px)]">
        {/* Header */}
        <header className="flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-primary/10 sticky top-0 z-10">
          <button className="text-primary dark:text-slate-100 flex size-10 shrink-0 items-center justify-center">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
          <h1 className="text-xl font-bold leading-tight tracking-tight flex-1 ml-2">
            Daily Report
          </h1>
          <button className="flex items-center justify-center p-2 rounded-lg bg-primary/5 text-primary">
            <span className="material-symbols-outlined">download</span>
          </button>
        </header>

        {/* Date Selector */}
        <div className="p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-primary/10 p-4 shadow-sm">
            <label className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">calendar_month</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-slate-100 font-medium"
              />
            </label>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              <p className="text-xs text-green-700 dark:text-green-400">Present</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              <p className="text-xs text-red-700 dark:text-red-400">Absent</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{stats.late}</p>
              <p className="text-xs text-amber-700 dark:text-amber-400">Late</p>
            </div>
          </div>
        </div>

        {/* Report Table */}
        <div className="px-4 pb-24">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-primary/10 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      In
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Out
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        Loading reports...
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        No records found for this date.
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {record.employeeName}
                          </p>
                          <p className="text-xs text-slate-500">{record.role}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {record.clientName}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {record.checkInTime}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {record.checkOutTime}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                          {record.totalHours > 0 ? `${record.totalHours}h` : '-'}
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <AdminBottomNav />
      </div>
    </div>
  );
}
