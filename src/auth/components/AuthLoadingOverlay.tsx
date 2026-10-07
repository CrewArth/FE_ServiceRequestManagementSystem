export function AuthLoadingOverlay({ message }: { message?: string } = {}) {
  return (
    <div role="status" aria-live="polite" className="fixed inset-0 z-[100] flex items-center justify-center bg-white/85 px-4 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-blue-100 bg-white px-10 py-7 shadow-lg shadow-blue-950/10">
        <img src="/assets/auth-loader.svg" alt="" className="h-14 w-14" />
        {message && <p className="text-sm font-semibold text-blue-950">{message}</p>}
      </div>
    </div>
  );
}
