import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useUISettings } from '@/stores/uiSettings';

export function BottomNav() {
  const { dashboardVariant } = useUISettings();
  const isVariant1 = dashboardVariant === 1;

  const navItems = [
    { path: ROUTES.DASHBOARD, icon: 'home', label: 'Home' },
    { path: ROUTES.CLIENTS, icon: 'business', label: 'Clients' },
    { path: ROUTES.ATTENDANCE_HISTORY, icon: 'history', label: 'History' },
    { path: ROUTES.LEAVES, icon: 'edit_calendar', label: 'Leaves' },
    { path: ROUTES.PROFILE, icon: 'account_circle', label: 'Profile' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 z-20 ${
      isVariant1 
        ? 'border-primary/10 pb-4 pt-2' 
        : 'border-slate-200 dark:border-slate-800 pb-6 pt-3'
    }`}>
      <div className="flex gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-end gap-1 ${
                isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                <p className={`text-xs leading-normal tracking-[0.015em] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</p>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
