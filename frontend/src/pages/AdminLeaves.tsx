import { useState, useEffect } from 'react';
import { leaveService } from '@/services/leaveService';
import { AdminBottomNav, AdminSidebar } from '@/components/layout';
import type { LeaveRequest } from '@/types';

export function AdminLeaves() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Modal for modifying balances
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [sickTotal, setSickTotal] = useState(7);
  const [annualTotal, setAnnualTotal] = useState(15);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const data = await leaveService.getAllRequests(1, 100, statusFilter || undefined);
      setRequests(data.records);
    } catch (error: any) {
      console.error('Failed to load leave requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      await leaveService.updateRequestStatus(id, newStatus);
      loadRequests();
    } catch (error: any) {
      alert(error?.response?.data?.error?.message || 'Failed to update status');
    }
  };

  const handleUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setIsUpdating(true);
    try {
      await leaveService.updateLeaveBalance(
        selectedUserId,
        new Date().getFullYear(),
        sickTotal,
        annualTotal
      );
      setShowBalanceModal(false);
      setSelectedUserId('');
      alert('Balance updated successfully');
    } catch (error: any) {
      alert(error?.response?.data?.error?.message || 'Failed to update balance');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 pb-20">
      <AdminSidebar />
      <div className="flex-1 flex flex-col relative w-full overflow-x-hidden md:max-w-[calc(100vw-256px)]">
      <header className="bg-white dark:bg-slate-900 border-b border-primary/10 sticky top-0 z-10 flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <button className="text-primary dark:text-slate-100 flex size-10 shrink-0 items-center justify-center">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
          <h1 className="text-xl font-bold">Leave Requests</h1>
        </div>
        <button
          onClick={() => setShowBalanceModal(true)}
          className="bg-primary text-white py-2 px-3 rounded-lg flex items-center gap-1 hover:bg-primary/90 transition-colors text-xs font-bold"
        >
          <span className="material-symbols-outlined text-sm">settings</span> Set Balances
        </button>
      </header>

      <main className="p-4 md:p-6 space-y-6">
        <div className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-primary/5">
          {['', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {status || 'All'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-primary/5">
            No requests found
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white dark:bg-slate-800 border border-primary/5 p-4 rounded-xl shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold">
                      {request.user?.firstName} {request.user?.lastName}
                    </h3>
                    <p className="text-xs text-slate-500">{request.user?.email}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                      request.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : request.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="flex gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium my-2">
                  <span className="capitalize">{request.type} Leave:</span>
                  <span>
                    {new Date(request.startDate).toLocaleDateString()} -{' '}
                    {new Date(request.endDate).toLocaleDateString()} ({request.days} days)
                  </span>
                </div>
                {request.reason && (
                  <p className="text-sm text-slate-500 italic mb-4">"{request.reason}"</p>
                )}

                {request.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => handleStatusUpdate(request.id, 'rejected')}
                      className="py-2 border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-bold transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request.id, 'approved')}
                      className="py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Balance Setup Modal */}
      {showBalanceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="font-bold text-lg">Update User Balance</h2>
              <button
                onClick={() => setShowBalanceModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdateBalance} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">User ID</label>
                <input
                  type="text"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  placeholder="Enter User ID (UUID)"
                  className="w-full border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg p-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sick Leave</label>
                  <input
                    type="number"
                    value={sickTotal}
                    onChange={(e) => setSickTotal(parseInt(e.target.value))}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Annual Leave</label>
                  <input
                    type="number"
                    value={annualTotal}
                    onChange={(e) => setAnnualTotal(parseInt(e.target.value))}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg p-2"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-primary text-white py-2 rounded-lg font-bold mt-2"
              >
                {isUpdating ? 'Updating...' : 'Update Balance'}
              </button>
            </form>
          </div>
        </div>
      )}

      <AdminBottomNav />
    </div>
    </div>

  );
}
