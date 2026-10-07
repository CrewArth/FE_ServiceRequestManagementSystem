import type { ReactNode } from 'react';

export function PageHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <header className="flex flex-wrap items-start justify-between gap-4">
    <div><h1 className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">{title}</h1><p className="mt-1 text-sm text-slate-600">{description}</p></div>
    {action}
  </header>;
}
