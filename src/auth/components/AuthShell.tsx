import type { ReactNode } from 'react';

export function AuthShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:py-16">
    <div className="w-full max-w-md rounded-xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-950/5 sm:p-9">
      <div className="mb-8 text-center">
        <p className="text-sm font-bold tracking-wide text-blue-700">Service Request System</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-blue-950">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>
      {children}
    </div>
  </main>;
}
