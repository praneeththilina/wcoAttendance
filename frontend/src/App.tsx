import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { ROUTES, ROLES } from '@/constants';

// Lazy load pages
import { 
  LoginPage, 
  EmployeeDashboard, 
  ClientSelection, 
  CheckinConfirmation,
  CheckOutScreen,
  ChangeClientLocation,
  AdminDashboard,
  DailyAttendanceReport,
  StaffDashboard,
  AttendanceHistory,
  Profile,
  AdminClients,
  AdminLeaves,
  Settings,
  ManagerDashboard,
  HRDashboard,
  Clients,
  Leaves
} from '@/pages';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case ROLES.ADMIN:
        return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
      case ROLES.MANAGER:
        return <Navigate to={ROUTES.MANAGER_DASHBOARD} replace />;
      case ROLES.HR:
        return <Navigate to={ROUTES.HR_DASHBOARD} replace />;
      default:
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  return <>{children}</>;
}

export function App() {
  useOfflineSync();
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        {/* Employee Routes */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ATTENDANCE_HISTORY}
          element={
            <ProtectedRoute>
              <AttendanceHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CLIENTS}
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.LEAVES}
          element={
            <ProtectedRoute>
              <Leaves />
            </ProtectedRoute>
          }
        />
        
        {/* Client Selection & Attendance */}
        <Route
          path={ROUTES.CLIENT_SELECTION}
          element={
            <ProtectedRoute>
              <ClientSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CHECKIN_CONFIRMATION}
          element={
            <ProtectedRoute>
              <CheckinConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CHECKOUT}
          element={
            <ProtectedRoute>
              <CheckOutScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CHANGE_CLIENT}
          element={
            <ProtectedRoute>
              <ChangeClientLocation />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_STAFF}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_CLIENTS}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminClients />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_LEAVES}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR, ROLES.MANAGER]}>
              <AdminLeaves />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_REPORTS}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <DailyAttendanceReport />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_SETTINGS}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path={ROUTES.MANAGER_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* HR Routes */}
        <Route
          path={ROUTES.HR_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.HR]}>
              <HRDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        
        {/* 404 - Catch all */}
        <Route path="*" element={
          <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary mb-2">404</h1>
              <p className="text-slate-500">Page not found</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
