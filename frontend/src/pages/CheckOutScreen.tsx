import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUISettings } from '@/stores/uiSettings';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { BottomNav } from '@/components/layout';
import { ROUTES } from '@/constants';

export function CheckOutScreen() {
  const navigate = useNavigate();
  const { checkOutVariant, setCheckOutVariant } = useUISettings();
  const {
    todayStatus: status,
    fetchTodayStatus,
    addToQueue,
    isOnline,
    setTodayStatus,
  } = useAttendanceStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [liveDuration, setLiveDuration] = useState<string | null>(null);

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

  const isVariant1 = checkOutVariant === 1;

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const handleCheckOut = async () => {
    setIsCheckingOut(true);
    try {
      const location = await getCurrentLocation();

      if (isOnline) {
        const { attendanceService } = await import('@/services/auth');
        await attendanceService.checkOut(location);
      } else {
        // Queue for later
        addToQueue({
          type: 'check-out',
          data: { location },
        });

        // Optimistically update status
        if (status) {
          setTodayStatus({
            ...status,
            status: 'checked_out',
            checkOutTime: new Date().toISOString(),
          });
        }
      }

      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Check-out failed';
      alert(message);
      console.error('Check-out failed:', message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
    accuracy?: number;
  }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: 0, longitude: 0 });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        () => resolve({ latitude: 0, longitude: 0 }),
        { enableHighAccuracy: true }
      );
    });
  };

  const checkInTime = status?.checkInTime ? new Date(status.checkInTime) : null;
  const hoursWorked = liveDuration ? parseFloat(liveDuration) : status?.totalHours || 0;
  const overtime = Math.max(0, hoursWorked - 8);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      <div className="max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-x-hidden min-h-screen flex flex-col">
        {/* Header */}
        <header
          className={`flex items-center p-4 justify-between bg-white dark:bg-slate-900 sticky top-0 z-10 ${
            isVariant1
              ? 'border-b border-slate-100 dark:border-slate-800'
              : 'border-b border-primary/10'
          }`}
        >
          <button
            onClick={() => navigate(-1)}
            className="text-primary dark:text-slate-100 flex size-10 items-center justify-center rounded-full hover:bg-primary/5"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex-1 text-center pr-10">
            Daily Check-out
          </h1>
          <button
            onClick={() => setCheckOutVariant(isVariant1 ? 2 : 1)}
            className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold"
          >
            v{checkOutVariant}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Summary Card */}
            <div
              className={`relative overflow-hidden bg-white dark:bg-slate-900 shadow-sm ${
                isVariant1
                  ? 'rounded-lg border border-slate-100 dark:border-slate-800'
                  : 'rounded-xl border border-primary/10'
              }`}
            >
              <div className="h-32 w-full bg-primary/10 bg-cover bg-center flex items-center justify-center">
                <span className="material-symbols-outlined text-primary/30 text-5xl">work</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active Session
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{today}</p>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Audit Attendance Summary
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {/* Current Client */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background-light dark:bg-slate-800/50">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">business</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Current Client
                      </p>
                      <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {status?.clientName || 'No client selected'}
                      </p>
                    </div>
                  </div>
                  {/* Check-in Time */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background-light dark:bg-slate-800/50">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">login</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Check-In Time
                      </p>
                      <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {checkInTime
                          ? checkInTime.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '---'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`flex flex-col gap-2 p-5 bg-white dark:bg-slate-900 shadow-sm ${
                  isVariant1
                    ? 'rounded-lg border border-slate-100 dark:border-slate-800'
                    : 'rounded-xl border border-primary/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Hours
                  </p>
                  <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                </div>
                <p className="text-3xl font-black text-primary dark:text-slate-100">
                  {hoursWorked.toFixed(1)}h
                </p>
                {overtime > 0 && (
                  <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span>Overtime: {overtime.toFixed(1)}h</span>
                  </div>
                )}
              </div>
              <div
                className={`flex flex-col gap-2 p-5 bg-white dark:bg-slate-900 shadow-sm ${
                  isVariant1
                    ? 'rounded-lg border border-slate-100 dark:border-slate-800'
                    : 'rounded-xl border border-primary/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tasks</p>
                  <span className="material-symbols-outlined text-primary text-xl">
                    assignment_turned_in
                  </span>
                </div>
                <p className="text-3xl font-black text-primary dark:text-slate-100">-</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  All tasks pending
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div
              className={`${
                isVariant1
                  ? 'relative overflow-hidden rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800'
                  : 'p-5 rounded-xl bg-primary/5 border border-primary/20'
              }`}
            >
              <div className={`flex items-start gap-3 ${isVariant1 ? 'p-4' : ''}`}>
                <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                <div>
                  <p className="text-sm font-bold text-primary">Ready to wrap up?</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                    Checking out will finalize your timesheet for today and notify the project
                    manager.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Actions */}
        <div className="mt-auto p-4 bg-white dark:bg-slate-900 border-t border-primary/10 space-y-4 pb-32">
          {status?.status === 'checked_in' ? (
            <button
              onClick={handleCheckOut}
              disabled={isCheckingOut}
              className={`w-full bg-primary hover:bg-[#3d2469] text-white font-bold py-4 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50 ${
                isVariant1 ? 'rounded-lg shadow-md' : 'rounded-xl shadow-lg shadow-primary/20'
              }`}
            >
              <span className="material-symbols-outlined">logout</span>
              {isCheckingOut ? 'Processing...' : 'Check Out Now'}
            </button>
          ) : (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-center">
              <p className="text-amber-700 dark:text-amber-400 font-bold text-sm">
                You are not currently checked in.
              </p>
              <button
                onClick={() => navigate(ROUTES.CLIENT_SELECTION)}
                className="mt-2 text-primary dark:text-primary-light font-bold text-xs uppercase tracking-wider underline"
              >
                Go to Check-in
              </button>
            </div>
          )}
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
