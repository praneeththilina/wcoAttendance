import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES, ROLES } from '@/constants';

// Lazy load pages
import { LoginPage } from '@/pages/LoginPage';

// Placeholder components for routes not yet implemented
const Dashboard = () => <div className="p-4">Dashboard - Coming Soon</div>;
const AdminDashboard = () => <div className="p-4">Admin Dashboard - Coming Soon</div>;
const ManagerDashboard = () => <div className="p-4">Manager Dashboard - Coming Soon</div>;
const HRDashboard = () => <div className="p-4">HR Dashboard - Coming Soon</div>;
const AttendanceHistory = () => <div className="p-4">Attendance History - Coming Soon</div>;
const Clients = () => <div className="p-4">Clients - Coming Soon</div>;
const Profile = () => <div className="p-4">Profile - Coming Soon</div>;

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
    // Redirect to appropriate dashboard based on role
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
              <Dashboard />
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

        {/* Admin Routes */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
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
        <Route path="*" element={<div className="p-4">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
