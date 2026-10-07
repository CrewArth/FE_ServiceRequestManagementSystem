import type { ReactNode } from 'react';

type Tone = 'blue' | 'cyan' | 'amber' | 'green' | 'orange' | 'red';
const accents: Record<Tone, string> = {
  blue: 'bg-blue-50 text-blue-700', cyan: 'bg-cyan-50 text-cyan-700',
  amber: 'bg-amber-50 text-amber-700', green: 'bg-green-50 text-green-700',
  orange: 'bg-orange-50 text-orange-700', red: 'bg-red-50 text-red-700',
};

export function MetricCard({ label, value, hint, tone, icon }: { label: string; value: number; hint: string; tone: Tone; icon: ReactNode }) {
  return <div className="card transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
    <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-slate-600">{label}</p><span aria-hidden="true" className={`flex h-9 w-9 items-center justify-center rounded-lg ${accents[tone]}`}>{icon}</span></div>
    <p className="mt-3 text-3xl font-bold tabular-nums text-blue-950">{value}</p>
    <p className="mt-1 text-xs text-slate-500">{hint}</p>
  </div>;
}
