import type { ReactNode } from 'react';

export function AuthShell({ title, description, children, compact = false }: { title: string; description: string; children: ReactNode; compact?: boolean }) {
  return <main className={`flex min-h-[100dvh] items-center justify-center px-3 py-4 sm:px-6 ${compact ? 'sm:py-6' : 'sm:py-8 lg:py-12'}`}>
    <div className={`grid w-full max-w-md overflow-hidden rounded-xl border border-blue-100 bg-white shadow-xl shadow-blue-950/10 sm:rounded-2xl lg:grid-cols-[1.1fr_0.9fr] ${compact ? 'lg:max-w-5xl' : 'lg:max-w-6xl'}`}>
      <div className={`flex items-center bg-blue-50 px-5 ${compact ? 'py-6 sm:px-8 sm:py-8 lg:px-10' : 'py-7 sm:px-10 sm:py-12 lg:px-14'}`}>
        <div className="mx-auto w-full max-w-md">
          <div className={compact ? 'mb-6' : 'mb-8'}>
            <p className="text-sm font-bold tracking-wide text-blue-700">Service Request System</p>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </div>
          {children}
        </div>
      </div>
      <div className="relative hidden min-h-full border-l border-blue-100 bg-white lg:block">
        <img src="/assets/auth-illustration.avif" alt="Service request illustration" className="absolute inset-0 h-full w-full object-contain p-4 sm:p-6 lg:p-8" />
      </div>
    </div>
  </main>;
}
