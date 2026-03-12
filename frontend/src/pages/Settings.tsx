import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { AdminBottomNav } from '@/components/layout';
import { ROUTES } from '@/constants';

export function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-primary/10 sticky top-0 z-10">
        <button className="text-primary dark:text-slate-100 flex size-10 shrink-0 items-center justify-center">
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
        <h1 className="text-xl font-bold leading-tight tracking-tight flex-1 ml-2">
          Settings
        </h1>
      </header>

      <div className="p-4 pb-24 space-y-4">
        {/* Profile Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-primary/5 p-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Profile</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-primary/5 p-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">App Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">dark_mode</span>
                <span className="text-sm">Dark Mode</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-primary' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">notifications</span>
                <span className="text-sm">Push Notifications</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-primary' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">location_on</span>
                <span className="text-sm">Location Tracking</span>
              </div>
              <button
                onClick={() => setLocationTracking(!locationTracking)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  locationTracking ? 'bg-primary' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    locationTracking ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-primary/5 p-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Company</h3>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">business</span>
                <span className="text-sm">Organization Info</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
            <button className="w-full flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">help</span>
                <span className="text-sm">Help & Support</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
            <button className="w-full flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">description</span>
                <span className="text-sm">Terms & Privacy</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-sm text-slate-500">AA Attendance</p>
          <p className="text-xs text-slate-400">Version 1.0.0</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 font-medium text-sm flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>

      <AdminBottomNav />
    </div>
  );
}
