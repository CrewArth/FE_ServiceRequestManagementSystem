import type { ReactNode } from 'react';

export function AuthShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
    <div className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl shadow-blue-950/10 md:grid-cols-[1.1fr_0.9fr]">
      <div className="flex items-center bg-blue-50 px-6 py-9 sm:px-10 sm:py-12 lg:px-14">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-bold tracking-wide text-blue-700">Service Request System</p>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </div>
          {children}
        </div>
      </div>
      <div className="relative min-h-48 border-t border-blue-100 bg-white md:min-h-full md:border-l md:border-t-0">
        <img src="/assets/auth-illustration.avif" alt="Service request illustration" className="absolute inset-0 h-full w-full object-contain p-4 sm:p-6 lg:p-8" />
      </div>
    </div>
  </main>;
}
