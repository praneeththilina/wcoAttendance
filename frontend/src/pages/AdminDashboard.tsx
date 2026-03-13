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

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(() => loadDashboard(false), 30000); // Live sync every 30s
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-display text-slate-900 dark:text-slate-100 pb-20">
      <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto bg-white dark:bg-background-dark shadow-2xl overflow-x-hidden">
        {/* Header */}
        <header className="flex items-center bg-white dark:bg-background-dark p-4 justify-between sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
          <div className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center">
            <span className="material-symbols-outlined">menu</span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
            Attendance Dashboard
          </h2>
          <div className="flex gap-2 items-center justify-end">
            <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">
                notifications
              </span>
            </button>
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              <img
                alt="Admin Profile"
                className="size-full object-cover"
                data-alt="Professional male HR admin avatar portrait"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuClG7qU97CVTpqVk4sBdfc0z-1AhprGn6tQipQQx-YbeMnf77M3c6wK9yZsadKf7jAX43fz-5rM0U8BVV_Jp1eu36i_hHFEJOJ0pg8iw05GpLo66fyNXSwqZuEYed62TCc2H-J8ojxMy3aUU99s3kjwktq3bGe3j32mcZkeKsE94i6kD3B3ph2hFCrr2JGz3TcKRB7ovSHzwhCs0ZkwHOHwLFu5n9qvnQ8ggCcHhX4QgnnpnWzFfBalPv4eGXz5Yaf3NKprwkcpMuTb"
              />
            </div>
          </div>
        </header>
        {/* Stats Horizontal Scroll */}
        <div className="flex overflow-x-auto gap-4 p-4 no-scrollbar">
          <div className="flex min-w-[160px] flex-col gap-2 rounded-xl p-4 bg-primary text-white shadow-lg shadow-primary/20">
            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
              Total Employees
            </p>
            <p className="text-2xl font-bold">{stats.totalEmployees}</p>
            <div className="mt-1 h-1 w-12 bg-white/30 rounded-full"></div>
          </div>
          <div className="flex min-w-[140px] flex-col gap-2 rounded-xl p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              Checked In
            </p>
            <p className="text-slate-900 dark:text-slate-100 text-2xl font-bold">
              {stats.checkedIn}
            </p>
            <div className="mt-1 h-1 w-12 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex min-w-[140px] flex-col gap-2 rounded-xl p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              At Office
            </p>
            <p className="text-slate-900 dark:text-slate-100 text-2xl font-bold">
              {stats.atOffice}
            </p>
            <div className="mt-1 h-1 w-12 bg-blue-500 rounded-full"></div>
          </div>
          <div className="flex min-w-[140px] flex-col gap-2 rounded-xl p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              At Client
            </p>
            <p className="text-slate-900 dark:text-slate-100 text-2xl font-bold">
              {stats.atClientSites}
            </p>
            <div className="mt-1 h-1 w-12 bg-amber-500 rounded-full"></div>
          </div>
        </div>
        {/* Search Bar */}
        <div className="px-4 py-2">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-slate-400">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all"
              placeholder="Search staff members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
            />
          </div>
        </div>
        {/* Live Staff Board Header */}
        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">
            Live Staff Board
          </h2>
          <button className="text-primary text-sm font-semibold">View All</button>
        </div>
        {/* Staff List */}
        <div className="flex flex-col px-4 pb-24 gap-3">
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading live status...</div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-8 text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              No staff found matching search.
            </div>
          ) : (
            filteredStaff.map((member) => (
              <div
                key={member.id}
                className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="size-12 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
                      {member.firstName[0]}
                      {member.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">
                        {member.firstName} {member.lastName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{member.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={member.status} />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-sm">
                      {member.status === 'travel'
                        ? 'commute'
                        : member.status === 'checked_out'
                          ? 'home'
                          : 'location_on'}
                    </span>
                    <span className="text-xs font-semibold line-clamp-1 max-w-[150px]">
                      {member.clientName
                        ? `${member.clientName}${member.clientCity ? `, ${member.clientCity}` : ''}`
                        : member.status === 'checked_out'
                          ? 'Checked Out'
                          : 'Not at a site'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span className="text-xs font-semibold">{member.checkInTime || '---'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AdminBottomNav />
    </div>
  );
}
