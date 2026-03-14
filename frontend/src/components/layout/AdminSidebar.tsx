import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  STAFF: '/admin/staff',
  CLIENTS: '/admin/clients',
  REPORTS: '/admin/reports',
  LEAVES: '/admin/leaves',
  SETTINGS: '/admin/settings',
} as const;

export function AdminSidebar() {
  const { logout } = useAuthStore();
  const navItems = [
    { path: ADMIN_ROUTES.DASHBOARD, icon: 'dashboard', label: 'Dashboard' },
    { path: ADMIN_ROUTES.STAFF, icon: 'badge', label: 'Staff' },
    { path: ADMIN_ROUTES.CLIENTS, icon: 'handshake', label: 'Clients' },
    { path: ADMIN_ROUTES.REPORTS, icon: 'description', label: 'Reports' },
    { path: ADMIN_ROUTES.LEAVES, icon: 'today', label: 'Leaves' },
    { path: ADMIN_ROUTES.SETTINGS, icon: 'settings', label: 'Settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-screen sticky top-0">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xl">
          A
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight text-slate-900 dark:text-slate-100">
            Audit Firm
          </h1>
          <p className="text-xs text-slate-500 font-medium">Admin Portal</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-primary text-white font-semibold shadow-md shadow-primary/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`material-symbols-outlined text-[20px] ${isActive ? '' : 'opacity-70'}`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
