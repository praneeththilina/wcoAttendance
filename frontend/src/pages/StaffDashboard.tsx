import { useState, useEffect } from 'react';
import { AdminBottomNav } from '@/components/layout';
import { adminService, StaffMember } from '@/services/adminService';

export function StaffDashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'checked_in' | 'checked_out'>('all');
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    password: '',
    role: 'employee',
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllStaff();
      setStaff(data);
    } catch (error: any) {
      console.error('Failed to load staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createStaff(newStaff);
      setShowAddModal(false);
      loadStaff();
      setNewStaff({
        firstName: '',
        lastName: '',
        email: '',
        employeeId: '',
        password: '',
        role: 'employee',
      });
    } catch (error: any) {
      console.error('Failed to add staff:', error);
      alert('Failed to add staff member. Check console.');
    }
  };

  const filteredStaff = staff.filter((member) => {
    if (activeTab === 'all') return true;
    return member.todayStatus === activeTab;
  });

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'checked_in':
        return <span className="w-2 h-2 rounded-full bg-green-500"></span>;
      case 'checked_out':
        return <span className="w-2 h-2 rounded-full bg-slate-400"></span>;
      default:
        return <span className="w-2 h-2 rounded-full bg-amber-500"></span>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'checked_in':
        return 'Checked In';
      case 'checked_out':
        return 'Checked Out';
      default:
        return 'Not Reported';
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-primary/10 sticky top-0 z-10">
        <button className="text-primary dark:text-slate-100 flex size-10 shrink-0 items-center justify-center">
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
        <h1 className="text-xl font-bold leading-tight tracking-tight flex-1 ml-2">
          Staff Management
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center p-2 rounded-lg bg-primary text-white"
        >
          <span className="material-symbols-outlined">person_add</span>
        </button>
      </header>

      {/* Stats */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-primary/5">
            <p className="text-2xl font-bold text-primary">{staff.length}</p>
            <p className="text-xs text-slate-500">Total Staff</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-primary/5">
            <p className="text-2xl font-bold text-green-600">
              {staff.filter((s) => s.todayStatus === 'checked_in').length}
            </p>
            <p className="text-xs text-slate-500">Present Today</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-primary/5">
            <p className="text-2xl font-bold text-slate-400">
              {staff.filter((s) => s.todayStatus === 'not_reported').length}
            </p>
            <p className="text-xs text-slate-500">Not Reported</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-4">
        <div className="flex bg-white dark:bg-slate-800 rounded-xl border border-primary/10 p-1">
          {(['all', 'checked_in', 'checked_out'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'checked_in' ? 'Present' : 'Absent'}
            </button>
          ))}
        </div>
      </div>

      {/* Staff List */}
      <div className="px-4 pb-32 space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-slate-500">Loading staff...</div>
        ) : filteredStaff.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No staff found.</div>
        ) : (
          filteredStaff.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-primary/5 shadow-sm hover:border-primary/20 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {member.name}
                  </p>
                  {member.status === 'inactive' && (
                    <span className="text-xs text-red-500">(Inactive)</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 truncate">{member.role}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {getStatusIndicator(member.todayStatus)}
                <span className="text-xs text-slate-500">{getStatusText(member.todayStatus)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Add Staff Member
            </h3>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="First Name"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2"
                  value={newStaff.firstName}
                  onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                />
                <input
                  required
                  placeholder="Last Name"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2"
                  value={newStaff.lastName}
                  onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                />
              </div>
              <input
                required
                type="email"
                placeholder="Email Address"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Employee ID"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2"
                  value={newStaff.employeeId}
                  onChange={(e) => setNewStaff({ ...newStaff, employeeId: e.target.value })}
                />
                <select
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <input
                required
                type="password"
                placeholder="Initial Password"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2"
                value={newStaff.password}
                onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 px-4 rounded-xl font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-xl font-semibold text-white bg-primary shadow-lg shadow-primary/30"
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminBottomNav />
    </div>
  );
}
