import { Suspense } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { dashboardPath, requestsPath } from '../common/constants/routes';
import { ContentLoading } from '../lazy/LoadingFallback';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
    isActive ? 'bg-blue-100 text-blue-900' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-900'
  }`;

function DashboardIcon() {
  return <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
}

function RequestsIcon() {
  return <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></svg>;
}

export function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  function logout() {
    signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col border-r border-blue-100 bg-white px-2 py-6 sm:w-60 sm:px-4" aria-label="Sidebar">
        <div className="mb-8 px-1 text-center sm:px-2 sm:text-left">
          <span className="text-lg font-bold text-blue-950 sm:hidden" aria-label="Service Request System">SR</span>
          <span className="hidden text-lg font-bold leading-tight text-blue-950 sm:block">Service Request System</span>
        </div>
        <nav aria-label="Main navigation" className="space-y-1">
          <NavLink to={dashboardPath(user.role)} className={linkClass} title="Dashboard" aria-label="Dashboard"><DashboardIcon /><span className="hidden sm:inline">Dashboard</span></NavLink>
          <NavLink to={requestsPath(user.role)} className={linkClass} title="Requests" aria-label="Requests"><RequestsIcon /><span className="hidden sm:inline">Requests</span></NavLink>
        </nav>
        <div className="mt-auto border-t border-blue-100 pt-4">
          <div className="hidden px-3 pb-3 sm:block">
            <p className="truncate text-sm font-semibold text-blue-950">{user.name}</p>
            <p className="text-xs capitalize text-slate-500">{user.role.toLowerCase()}</p>
          </div>
          <button type="button" onClick={logout} title="Sign out" aria-label="Sign out" className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-900">
            <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M16 17l5-5-5-5M21 12H9" /></svg>
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Suspense fallback={<ContentLoading />}><Outlet /></Suspense>
        </div>
      </main>
    </div>
  );
}
