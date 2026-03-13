import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveService } from '@/services/leaveService';
import { BottomNav } from '@/components/layout';
import type { LeaveBalance, LeaveRequest } from '@/types';

export function Leaves() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Quick Request form state
  const [leaveType, setLeaveType] = useState('sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [days, setDays] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadLeavesData();
  }, []);

  const loadLeavesData = async () => {
    try {
      setIsLoading(true);
      const year = new Date().getFullYear();
      const [balData, reqData] = await Promise.all([
        leaveService.getMyBalance(year),
        leaveService.getMyRequests(1, 100),
      ]);
      setBalance(balData);
      setRequests(reqData.records);
    } catch (error: any) {
      console.error('Failed to load leaves data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await leaveService.createLeaveRequest({
        type: leaveType,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        reason,
        days,
      });
      loadLeavesData();

      // Reset form
      setLeaveType('sick');
      setStartDate('');
      setEndDate('');
      setReason('');
      setDays(1);
      alert('Leave request submitted successfully');
    } catch (error: any) {
      alert(error?.response?.data?.error?.message || 'Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 pb-20">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold">Leave Dashboard</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading leave data...</div>
        ) : (
          <>
            {/* Balances Horizontal Scroll */}
            <div className="-mx-4 px-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
              <div className="flex gap-4 w-max">
                <div className="bg-primary text-white w-40 p-4 rounded-2xl shadow-md snap-start shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="material-symbols-outlined bg-white/20 p-2 rounded-xl">
                      medical_services
                    </span>
                  </div>
                  <span className="block text-sm font-medium text-white/80 mb-1">Sick Leave</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {balance ? balance.sickLeaveTotal - balance.sickLeaveUsed : 0}
                    </span>
                    <span className="text-sm font-medium text-white/60">
                      / {balance?.sickLeaveTotal || 7} days
                    </span>
                  </div>
                </div>

                <div className="bg-[#1e293b] text-white w-40 p-4 rounded-2xl shadow-md snap-start shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="material-symbols-outlined bg-white/10 p-2 rounded-xl">
                      flight_takeoff
                    </span>
                  </div>
                  <span className="block text-sm font-medium text-slate-300 mb-1">
                    Annual Leave
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {balance ? balance.annualLeaveTotal - balance.annualLeaveUsed : 0}
                    </span>
                    <span className="text-sm font-medium text-slate-400">
                      / {balance?.annualLeaveTotal || 15} days
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-40 p-4 rounded-2xl shadow-sm snap-start shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="material-symbols-outlined bg-slate-100 dark:bg-slate-700 text-slate-500 p-2 rounded-xl">
                      calendar_month
                    </span>
                  </div>
                  <span className="block text-sm font-medium text-slate-500 mb-1">
                    Unpaid Leave
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-800 dark:text-white">
                      {balance?.unpaidLeaveUsed || 0}
                    </span>
                    <span className="text-sm font-medium text-slate-400">days used</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Request Inline Form */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_calendar</span>
                Quick Request
              </h2>
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Leave Type
                    </label>
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary font-medium"
                      required
                    >
                      <option value="sick">Sick Leave</option>
                      <option value="annual">Annual Leave</option>
                      <option value="unpaid">Unpaid Leave</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Total Days
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={days}
                      onChange={(e) => setDays(parseFloat(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary font-medium"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Reason (Optional)
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary font-medium"
                      placeholder="Doctor appointment, vacation..."
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white p-3 rounded-xl font-bold shadow-md shadow-primary/20 transition-all disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Request Leave'}
                </button>
              </form>
            </div>

            {/* Recent Requests */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h2 className="font-bold text-lg">Recent Requests</h2>
                <span className="text-xs font-medium text-slate-500">{requests.length} total</span>
              </div>

              {requests.length === 0 ? (
                <div className="text-center py-10 text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                  <p className="text-sm">No recent requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                            request.type === 'sick'
                              ? 'bg-red-50 text-red-500 dark:bg-red-500/10'
                              : request.type === 'annual'
                                ? 'bg-blue-50 text-blue-500 dark:bg-blue-500/10'
                                : 'bg-slate-50 text-slate-500 dark:bg-slate-500/10'
                          }`}
                        >
                          <span className="material-symbols-outlined">
                            {request.type === 'sick'
                              ? 'medical_services'
                              : request.type === 'annual'
                                ? 'flight_takeoff'
                                : 'event_note'}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-sm capitalize text-slate-900 dark:text-white">
                            {request.type} Leave
                          </p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {new Date(request.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            -{' '}
                            {new Date(request.endDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          {request.reason && (
                            <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[150px]">
                              {request.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            request.status === 'approved'
                              ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                              : request.status === 'rejected'
                                ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                          }`}
                        >
                          {request.status}
                        </span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {request.days}d
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* For employee show BottomNav */}
      <BottomNav />
    </div>
  );
}
