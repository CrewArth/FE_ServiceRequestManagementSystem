import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { PageHeader } from '../../common/components/PageHeader';
import { Skeleton } from '../../common/components/Skeleton';
import { ROLES } from '../../common/constants/roles';
import type { Summary } from '../../common/types/api.types';
import { requestsApi } from '../../utils/api';
import { MetricCard } from '../components/MetricCard';
import { StatusChart } from '../components/StatusChart';

const metrics = [
  { key: 'total', label: 'Total requests', hint: 'All recorded requests', tone: 'blue', icon: '▦' },
  { key: 'open', label: 'Open', hint: 'Awaiting action', tone: 'cyan', icon: '○' },
  { key: 'inProgress', label: 'In progress', hint: 'Currently being handled', tone: 'amber', icon: '◷' },
  { key: 'resolved', label: 'Resolved', hint: 'Completed requests', tone: 'green', icon: '✓' },
  { key: 'highPriority', label: 'High priority', hint: 'Needs attention', tone: 'orange', icon: '!' },
  { key: 'overdue', label: 'Overdue', hint: 'Past the response window', tone: 'red', icon: '⌛' },
] as const;

function DashboardSkeleton() {
  return <div role="status" aria-label="Loading dashboard" className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{metrics.map(({ key }) => <div key={key} className="card space-y-4"><Skeleton className="h-4 w-28" /><Skeleton className="h-9 w-16" /><Skeleton className="h-3 w-36" /></div>)}</div>
    <div className="card"><Skeleton className="h-5 w-48" /><Skeleton className="mt-6 h-32 w-full" /></div>
  </div>;
}

export function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try { setSummary(await requestsApi.summary()); }
    catch { setError('Dashboard data is unavailable. Please try again.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return <div className="space-y-6">
    <PageHeader title="Dashboard" description={user?.role === ROLES.ADMIN ? 'Track service request activity across the system.' : 'Track and manage your service request activity.'} action={<button type="button" className="button-secondary" onClick={() => void load()}>Refresh</button>} />
    {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"><span>{error}</span><button type="button" className="font-semibold underline" onClick={() => void load()}>Retry</button></div>}
    {loading && !summary ? <DashboardSkeleton /> : summary && <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map(({ key, label, hint, tone, icon }) => <MetricCard key={key} label={label} value={summary[key]} hint={hint} tone={tone} icon={icon} />)}
      </div>
      <StatusChart summary={summary} />
      {/* <section className="rounded-lg border border-blue-100 bg-white/75 px-5 py-4"><h2 className="text-sm font-semibold text-blue-950">System status</h2><p className="mt-1 text-xs text-slate-500">Last overdue check: {summary.lastOverdueCheck ? new Date(summary.lastOverdueCheck).toLocaleString() : 'Waiting for the first successful overdue check.'}</p></section> */}
    </>}
  </div>;
}
