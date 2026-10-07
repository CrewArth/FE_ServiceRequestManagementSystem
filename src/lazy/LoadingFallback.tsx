export function PageLoading() {
  return (
    <div
      role="status"
      className="flex min-h-screen items-center justify-center text-blue-900"
    >
      Loading page…
    </div>
  );
}

export function ContentLoading() {
  return <div role="status" className="card text-sm text-slate-600">Loading page…</div>;
}

export function RequestLoading() {
  return (
    <div
      role="status"
      className="px-5 py-12 text-center text-sm text-slate-600"
    >
      Loading requests…
    </div>
  );
}

export function DialogLoading() {
  return (
    <div
      role="status"
      className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/50 text-sm font-semibold text-white"
    >
      Loading dialog…
    </div>
  );
}
