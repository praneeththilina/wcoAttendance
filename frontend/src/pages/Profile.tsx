import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { BottomNav } from '@/components/layout';
import { ROUTES } from '@/constants';

export function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'manager':
        return 'Manager';
      case 'hr':
        return 'HR';
      case 'employee':
      default:
        return 'Employee';
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="max-w-md mx-auto bg-background-light dark:bg-background-dark">
        {/* Header */}
        <header className="flex items-center bg-white dark:bg-slate-900 p-4 border-b border-primary/10 sticky top-0 z-10">
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
            Profile
          </h1>
        </header>

        {/* Profile Content */}
        <div className="p-4 pb-24">
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-4xl">person</span>
              </div>
              <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-slate-500">{user?.email}</p>
              <span className="mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {getRoleDisplay(user?.role || 'employee')}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400">badge</span>
                  <span className="text-sm">Employee ID</span>
                </div>
                <span className="font-medium text-sm">{user?.employeeId || '---'}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400">email</span>
                  <span className="text-sm">Email</span>
                </div>
                <span className="font-medium text-sm">{user?.email || '---'}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400">phone</span>
                  <span className="text-sm">Phone</span>
                </div>
                <span className="font-medium text-sm text-slate-500">Not set</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400">calendar_today</span>
                  <span className="text-sm">Member Since</span>
                </div>
                <span className="font-medium text-sm">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '---'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 space-y-3">
            <button className="w-full py-3 px-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-medium text-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">edit</span>
              Edit Profile
            </button>
            <button className="w-full py-3 px-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-medium text-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">lock</span>
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 font-medium text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
