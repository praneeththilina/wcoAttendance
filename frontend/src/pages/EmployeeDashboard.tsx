import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { BottomNav } from '@/components/layout';
import { StatusBadge } from '@/components/ui';
import { ROUTES } from '@/constants';

export function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { todayStatus: status, fetchTodayStatus, isSyncing, isOnline } = useAttendanceStore();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [liveDuration, setLiveDuration] = useState<string | null>(null);

  const dashboardVariant = 1;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status?.status === 'checked_in' && status.checkInTime) {
      const updateDuration = () => {
        const checkInDate = new Date(status.checkInTime as string);
        const now = new Date();
        const diffInMs = Math.abs(now.getTime() - checkInDate.getTime());
        const diffInHrs = diffInMs / (1000 * 60 * 60);
        setLiveDuration(`${diffInHrs.toFixed(1)}h`);
      };
      updateDuration(); // initial call
      interval = setInterval(updateDuration, 60000); // update every minute
    } else {
      setLiveDuration(status?.totalHours ? `${status.totalHours.toFixed(1)}h` : '---');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  const isVariant1 = dashboardVariant === 1;

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      navigate(ROUTES.CLIENT_SELECTION);
    } catch (error: unknown) {
      console.error('Check-in failed:', error);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      navigate(ROUTES.CHECKOUT);
    } catch (error: unknown) {
      console.error('Check-out failed:', error);
    }
  };

  const isCheckedIn = status?.status === 'checked_in';
  const isCheckedOut = status?.status === 'checked_out';

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      <div
        className={`max-w-md mx-auto border-x ${isVariant1 ? 'border-primary/10' : 'border-transparent'}`}
      >
        {/* Header */}
        <header
          className={`flex items-center ${isVariant1 ? 'bg-background-light dark:bg-background-dark' : 'bg-white dark:bg-background-dark'} p-4 ${isVariant1 ? 'pb-2' : 'pb-4'} justify-between sticky top-0 z-10 border-b ${isVariant1 ? 'border-primary/5' : 'border-slate-200 dark:border-slate-800'}`}
        >
          <div className="flex size-10 shrink-0 items-center">
            <div
              className={`flex items-center justify-center rounded-full size-10 ${isVariant1 ? 'bg-primary/10' : 'bg-primary/5 border border-primary/10'}`}
            >
              <span className="material-symbols-outlined text-primary">account_circle</span>
            </div>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 ml-3">
            Attendance
          </h2>

          {(!isOnline || isSyncing) && (
            <div
              className={`mr-2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isSyncing
                  ? 'bg-blue-100 text-blue-700 animate-pulse'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {isSyncing ? 'sync' : 'cloud_off'}
              </span>
              {isSyncing ? 'Syncing...' : 'Offline'}
            </div>
          )}

          <button
            onClick={() => {
              logout();
              navigate(ROUTES.LOGIN);
            }}
            className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-transparent"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </header>

        {/* Welcome Section */}
        <div
          className={`flex ${isVariant1 ? 'p-4 @container' : 'px-6 py-8 @container bg-white dark:bg-background-dark/30'} ${!isVariant1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
        >
          <div className="flex w-full flex-col gap-4 items-start">
            <div className="flex gap-4 flex-row items-center">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-primary/20 shadow-sm bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">person</span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-2xl font-bold leading-tight tracking-[-0.015em]">
                  Welcome, {user?.firstName || 'User'}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium capitalize">
                  {user?.role || 'Employee'} • {today}
                </p>
              </div>
            </div>
            <StatusBadge
              status={isCheckedIn ? 'checked_in' : isCheckedOut ? 'checked_out' : 'not_checked_in'}
            />
          </div>
        </div>

        {/* Main Action Area */}
        <div className="px-4 py-4 space-y-4">
          {!isCheckedIn && (
            <button
              onClick={handleCheckIn}
              disabled={isCheckingIn}
              className={`flex w-full cursor-pointer items-center justify-center px-5 bg-primary text-white active:scale-[0.98] transition-all disabled:opacity-50 ${
                isVariant1
                  ? 'rounded-xl h-20 shadow-lg shadow-primary/20'
                  : 'rounded-lg h-16 shadow-md hover:brightness-110'
              }`}
            >
              <span className="material-symbols-outlined mr-3 text-3xl">location_on</span>
              <div className="flex flex-col items-start">
                <span className="text-lg font-bold">
                  {isCheckedIn ? 'Update Location' : 'Check In'}
                </span>
                <span className="text-xs opacity-80">Capture current GPS location</span>
              </div>
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(ROUTES.CLIENT_SELECTION)}
              disabled={!isCheckedIn}
              className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg h-12 px-4 font-bold text-sm ${
                isCheckedIn
                  ? isVariant1
                    ? 'bg-primary/10 text-primary border border-primary/10 hover:bg-primary/20'
                    : 'bg-white dark:bg-slate-800 text-primary border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined mr-2 text-xl">business_center</span>
              <span className="truncate">Change Client</span>
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!isCheckedIn}
              className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg h-12 px-4 font-bold text-sm ${
                isCheckedIn
                  ? isVariant1
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 cursor-not-allowed'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined mr-2 text-xl">logout</span>
              <span className="truncate">Check Out</span>
            </button>
          </div>
        </div>

        {/* Today's Activity Card */}
        <div className="px-4 py-2">
          <div
            className={`bg-white dark:bg-background-dark/50 rounded-xl border p-5 shadow-sm ${
              isVariant1 ? 'border-primary/5' : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base">Today's Activity</h3>
              <span className="material-symbols-outlined text-slate-400 text-lg">history</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/5 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    Arrival Time
                  </span>
                </div>
                <span className="text-slate-900 dark:text-slate-100 font-semibold">
                  {status?.checkInTime
                    ? new Date(status.checkInTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '---'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/5 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-xl">
                      apartment
                    </span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    Current Client
                  </span>
                </div>
                <span className="text-slate-400 dark:text-slate-500 italic text-sm">
                  {status?.clientName || 'Not at a site'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/5 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-xl">
                      track_changes
                    </span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    Total Hours
                  </span>
                </div>
                <span className="text-slate-900 dark:text-slate-100 font-semibold">
                  {liveDuration}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Quick Preview */}
        <div className="px-4 py-4 mt-2">
          <div
            className={`relative w-full overflow-hidden border bg-primary/5 flex items-center justify-center ${
              isVariant1
                ? 'h-32 rounded-xl border-primary/10'
                : 'h-40 rounded-lg border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div className="relative bg-white/90 dark:bg-background-dark/90 px-3 py-1.5 rounded-full flex items-center shadow-md">
              <span className="material-symbols-outlined text-primary mr-1 text-sm">
                my_location
              </span>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                {isCheckedIn ? 'Location captured' : 'Ready to capture location'}
              </span>
            </div>
          </div>
        </div>

        <div className="h-20" />
        <BottomNav />
      </div>
    </div>
  );
}
