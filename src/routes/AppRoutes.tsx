import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { dashboardPath } from '../common/constants/routes';
import { ROLES, type Role } from '../common/constants/roles';
import { PageLoading } from '../lazy/LoadingFallback';
import { AppLayout, DashboardPage, LoginPage, RegisterPage, RequestsPage } from '../lazy/pages';

function RoleRoute({ role }: { role: Role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={dashboardPath(user.role)} replace />;
  return <AppLayout />;
}

export function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-blue-900">Loading account…</div>;
  return <Suspense fallback={<PageLoading />}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/employee" element={<RoleRoute role={ROLES.EMPLOYEE} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="requests" element={<RequestsPage />} />
      </Route>
      <Route path="/admin" element={<RoleRoute role={ROLES.ADMIN} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="requests" element={<RequestsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? dashboardPath(user.role) : '/login'} replace />} />
    </Routes>
  </Suspense>;
}
