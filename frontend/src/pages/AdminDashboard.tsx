import { useState, useEffect } from 'react';
import { AdminBottomNav } from '@/components/layout';
import { StatusBadge } from '@/components/ui';
import { adminService } from '@/services/adminService';

interface LocalStaffMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'checked_in' | 'checked_out' | 'incomplete' | 'travel' | 'not_checked_in';
  clientName?: string;
  clientCity?: string;
  checkInTime?: string;
}

interface DashboardStats {
  totalEmployees: number;
  checkedIn: number;
  atOffice: number;
  atClientSites: number;
}

export function AdminDashboard() {
  const [staff, setStaff] = useState<LocalStaffMember[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    checkedIn: 0,
    atOffice: 0,
    atClientSites: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getDashboardStats();
      setStaff(data.liveStaff);
      setStats({
        totalEmployees: data.totalEmployees,
        checkedIn: data.checkedIn,
        atOffice: data.atOffice,
        atClientSites: data.atClientSites,
      });
    } catch (error: any) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStaff = staff.filter(
    (member) =>
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-primary/10 sticky top-0 z-10">
        <button className="text-primary dark:text-slate-100 flex size-10 shrink-0 items-center justify-center">
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
        <h1 className="text-xl font-bold leading-tight tracking-tight flex-1 ml-2">
          Attendance Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <button className="relative flex items-center justify-center p-2 rounded-lg bg-primary/5 dark:bg-primary/20 text-primary dark:text-slate-100">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/10">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <div className="flex flex-col gap-1 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-primary/5">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Total Employees
          </p>
          <div className="flex items-end justify-between">
            <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">{stats.totalEmployees}</p>
            <span className="material-symbols-outlined text-primary/40">groups</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-primary/5">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Checked In
          </p>
          <div className="flex items-end justify-between">
            <p className="text-green-600 dark:text-green-400 text-3xl font-bold">{stats.checkedIn}</p>
            <span className="material-symbols-outlined text-green-500/40">check_circle</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-primary/5">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            At Office
          </p>
          <div className="flex items-end justify-between">
            <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">{stats.atOffice}</p>
            <span className="material-symbols-outlined text-primary/40">corporate_fare</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-primary/5">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            At Client Sites
          </p>
          <div className="flex items-end justify-between">
            <p className="text-amber-600 dark:text-amber-400 text-3xl font-bold">{stats.atClientSites}</p>
            <span className="material-symbols-outlined text-amber-500/40">distance</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-4 py-2 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <label className="flex flex-1 h-12">
            <div className="flex w-full items-stretch rounded-xl h-full shadow-sm bg-white dark:bg-slate-800 border border-primary/10 overflow-hidden">
              <div className="text-slate-400 flex items-center justify-center pl-4">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="w-full flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 px-4 text-sm"
                placeholder="Search staff members by name or site..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </label>
        </div>
      </div>

      {/* Staff List */}
      <main className="flex-1 p-4 pb-24 space-y-3">
        <h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg px-1 flex items-center justify-between">
          Live Staff Board
          <span className="text-xs font-normal text-slate-500 uppercase">
            Live Update • {formattedTime}
          </span>
        </h3>

        {isLoading ? (
          <div className="text-center py-8 text-slate-500">Loading...</div>
        ) : (
          filteredStaff.map((member) => (
            <div
              key={member.id}
              className="flex flex-col bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-primary/5 hover:border-primary/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400">person</span>
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-slate-100 font-semibold text-sm">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-slate-500 text-xs">{member.role}</p>
                  </div>
                </div>
                <StatusBadge status={member.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-700 pt-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-lg">
                    {member.status === 'travel' ? 'commute' : member.status === 'checked_out' ? 'home' : 'location_on'}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                    {member.clientName
                      ? `${member.clientName}${member.clientCity ? `, ${member.clientCity}` : ''}`
                      : member.status === 'checked_out'
                      ? 'Checked Out'
                      : 'Not at a site'}
                  </p>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="material-symbols-outlined text-slate-400 text-lg">schedule</span>
                  <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                    {member.checkInTime || '---'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      <AdminBottomNav />
    </div>
  );
}
