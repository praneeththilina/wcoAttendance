import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceService } from '@/services/auth';
import { BottomNav } from '@/components/layout';
import type { AttendanceRecord } from '@/types';

export function AttendanceHistory() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const limit = 10;

  useEffect(() => {
    loadHistory();
  }, [page]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await attendanceService.getHistory(
        page,
        limit,
        startDate || undefined,
        endDate || undefined
      );
      setRecords(data.records);
      setTotal(data.total);
    } catch (error: any) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = () => {
    setPage(1);
    loadHistory();
  };

  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '---';
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="max-w-md mx-auto bg-background-light dark:bg-background-dark">
        {/* Header */}
        <header className="flex items-center bg-white dark:bg-slate-900 p-4 border-b border-primary/10 sticky top-0 z-10">
          <button
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className="text-primary flex size-10 items-center justify-center rounded-full hover:bg-primary/10"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 ml-2">
            Attendance History
          </h1>
        </header>

        {/* Date Filters */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleFilter}
            className="w-full py-2 px-4 bg-primary text-white rounded-lg font-medium text-sm"
          >
            Apply Filter
          </button>
        </div>

        {/* Records List */}
        <div className="p-4 pb-24">
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading...</div>
          ) : !records || records.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No attendance records found</div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">business</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {(record as any).client?.name || 'Unknown Client'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(record as any).client?.city || ''}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'checked_in'
                          ? 'bg-green-100 text-green-700'
                          : record.status === 'checked_out'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {record.status === 'checked_in'
                        ? 'Active'
                        : record.status === 'checked_out'
                          ? 'Completed'
                          : 'Incomplete'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-slate-500">Check In</p>
                      <p className="font-medium text-sm">{formatTime(record.checkInTime)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Check Out</p>
                      <p className="font-medium text-sm">{formatTime(record.checkOutTime)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Hours</p>
                      <p className="font-medium text-sm">
                        {record.totalHours ? `${record.totalHours.toFixed(1)}h` : '---'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400">{formatDate(record.checkInTime)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
