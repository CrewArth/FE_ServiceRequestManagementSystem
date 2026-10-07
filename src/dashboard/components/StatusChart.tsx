import type { Summary } from '../../common/types/api.types';

const rows = [
  { key: 'open', label: 'Open', color: 'bg-blue-600' },
  { key: 'inProgress', label: 'In progress', color: 'bg-amber-500' },
  { key: 'resolved', label: 'Resolved', color: 'bg-green-600' },
] as const;

export function StatusChart({ summary }: { summary: Summary }) {
  const total = summary.open + summary.inProgress + summary.resolved;
  return <section className="card" aria-label="Request status overview">
    <h2 className="text-lg font-bold text-blue-950">Request status overview</h2>
    <p className="mt-1 text-sm text-slate-500">Distribution of {total} requests by status</p>
    <div className="mt-6 space-y-5">
      {rows.map(({ key, label, color }) => <div key={key} className="grid grid-cols-[6rem_1fr_3rem] items-center gap-3 sm:grid-cols-[8rem_1fr_3rem]">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <div className="h-3 overflow-hidden rounded-full bg-blue-50" role="img" aria-label={`${label}: ${summary[key]} of ${total}`}><div className={`h-full rounded-full ${color} transition-all duration-200`} style={{ width: `${total ? summary[key] / total * 100 : 0}%` }} /></div>
        <span className="text-right text-sm font-semibold tabular-nums text-blue-950">{summary[key]}</span>
      </div>)}
    </div>
  </section>;
}
