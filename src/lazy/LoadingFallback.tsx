import { AuthLoadingOverlay } from "../auth/components/AuthLoadingOverlay";

export function PageLoading() {
  return (
    <div
      role="status"
      className="flex min-h-screen items-center justify-center text-blue-900"
    >
      <AuthLoadingOverlay />
    </div>
  );
}

export function ContentLoading() {
  return <div role="status" className="card text-sm text-slate-600"> <AuthLoadingOverlay /></div>;
}

export function RequestLoading() {
  return (
    <div role="status" aria-label="Loading requests" className="space-y-3 p-5">
      {[0, 1, 2].map((row) => <div key={row} className="h-12 animate-pulse rounded-lg bg-blue-50" />)}
    </div>
  );
}

export function DialogLoading() {
  return (
    <div
      role="status"
      className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/50 text-sm font-semibold text-white"
    >
      <AuthLoadingOverlay />
    </div>
  );
}
