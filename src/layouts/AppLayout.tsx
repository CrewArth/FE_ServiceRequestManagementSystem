import { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { dashboardPath, requestsPath } from '../common/constants/routes';
import { ContentLoading } from '../lazy/LoadingFallback';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-200 ${
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
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  if (!user) return null;

  function logout() {
    signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen md:flex">
      <header className="flex h-16 items-center justify-between border-b border-blue-100 bg-white px-4 md:hidden">
        <span className="font-bold text-blue-950">Service Request System</span>
        <button type="button" aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="app-sidebar" onClick={() => setMenuOpen(true)} className="rounded-lg p-2 text-blue-900 hover:bg-blue-50">
          <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </header>
      {menuOpen && <button type="button" className="fixed inset-0 z-40 bg-blue-950/40 md:hidden" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside id="app-sidebar" className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-blue-100 bg-white px-4 py-6 shadow-xl transition-transform duration-200 md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:translate-x-0 md:shadow-none ${menuOpen ? 'visible translate-x-0' : 'invisible -translate-x-full md:visible'}`} aria-label="Sidebar">
        <div className="mb-8 flex items-start justify-between gap-3 px-2">
          <div><span className="text-lg font-bold leading-tight text-blue-950">Service Request System</span><p className="mt-1 text-xs text-slate-500">Request management</p></div>
          <button type="button" className="rounded-md p-1 text-slate-500 hover:bg-blue-50 md:hidden" aria-label="Close navigation" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <nav aria-label="Main navigation" className="space-y-1">
          <NavLink to={dashboardPath(user.role)} className={linkClass} onClick={() => setMenuOpen(false)}><DashboardIcon /><span>Dashboard</span></NavLink>
          <NavLink to={requestsPath(user.role)} className={linkClass} onClick={() => setMenuOpen(false)}><RequestsIcon /><span>Requests</span></NavLink>
        </nav>
        <div className="mt-auto border-t border-blue-100 pt-4">
          <div className="flex items-center gap-3 px-3 pb-4">
            <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-900">{user.name.trim().charAt(0).toUpperCase()}</span>
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-blue-950">{user.name}</p><p className="text-xs capitalize text-slate-500">{user.role.toLowerCase()}</p></div>
          </div>
          <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-900">
            <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M16 17l5-5-5-5M21 12H9" /></svg>
            Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-7xl"><Suspense fallback={<ContentLoading />}><Outlet /></Suspense></div>
      </main>
    </div>
  );
}
