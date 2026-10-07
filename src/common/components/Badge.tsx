type BadgeTone = 'blue' | 'amber' | 'green' | 'red' | 'slate';

const toneClass: Record<BadgeTone, string> = {
  blue: 'bg-blue-100 text-blue-800',
  amber: 'bg-amber-100 text-amber-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  slate: 'bg-slate-100 text-slate-700',
};

export function Badge({ children, tone = 'blue' }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass[tone]}`}>{children}</span>;
}
import type { ReactNode } from 'react';
