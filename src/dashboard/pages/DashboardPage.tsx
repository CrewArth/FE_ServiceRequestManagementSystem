import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { ROLES } from '../../common/constants/roles';
import type { Summary } from '../../common/types/api.types';
import { requestsApi } from '../../utils/api';

const metrics: { key: keyof Summary; label: string }[] = [
  { key: 'total', label: 'Total' },
  { key: 'open', label: 'Open' },
  { key: 'inProgress', label: 'In progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'highPriority', label: 'High priority' },
  { key: 'overdue', label: 'Overdue' },
];

export function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    requestsApi.summary()
      .then((value) => { if (active) setSummary(value); })
      .catch((cause) => { if (active) setError((cause as Error).message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold text-blue-950">
          {user?.role === ROLES.ADMIN ? 'All service requests' : 'My service requests'}
        </h1>
      </div>
      {error && <div role="alert" className="rounded-lg border border-red-200 bg-white p-4 text-sm text-red-700">{error}</div>}
      {loading ? (
        <div role="status" className="card text-sm text-slate-600">Loading dashboard…</div>
      ) : summary && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {metrics.map(({ key, label }) => (
              <div className="card" key={key}>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{label}</p>
                <p className="mt-3 text-3xl font-bold text-blue-950">{summary[key]}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Last overdue check: {summary.lastOverdueCheck
              ? new Date(summary.lastOverdueCheck).toLocaleString()
              : 'Not run yet'}
          </p>
        </>
      )}
    </div>
  );
}
