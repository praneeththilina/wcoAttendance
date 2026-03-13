import { NavLink } from 'react-router-dom';

const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  STAFF: '/admin/staff',
  CLIENTS: '/admin/clients',
  REPORTS: '/admin/reports',
  LEAVES: '/admin/leaves',
  SETTINGS: '/admin/settings',
} as const;

export function AdminBottomNav() {
  const navItems = [
    { path: ADMIN_ROUTES.DASHBOARD, icon: 'dashboard', label: 'Dashboard' },
    { path: ADMIN_ROUTES.STAFF, icon: 'badge', label: 'Staff' },
    { path: ADMIN_ROUTES.CLIENTS, icon: 'handshake', label: 'Clients' },
    { path: ADMIN_ROUTES.REPORTS, icon: 'description', label: 'Reports' },
    { path: ADMIN_ROUTES.LEAVES, icon: 'today', label: 'Leaves' },
    { path: ADMIN_ROUTES.SETTINGS, icon: 'settings', label: 'Settings' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full flex gap-2 border-t border-primary/10 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-4 pb-4 pt-2 shadow-lg z-20">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-1 ${
              isActive ? 'text-primary dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <p className="text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
