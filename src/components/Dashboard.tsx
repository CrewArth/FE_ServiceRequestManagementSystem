import { Suspense, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ROLES } from "../common/constants/roles";
import type {
  Meta,
  RequestFields,
  ServiceRequest,
  Summary,
} from "../common/types/api.types";
import { useAuth } from "../auth/AuthContext";
import { requestsApi } from "../utils/api";
import { DialogLoading, RequestLoading } from "../lazy/LoadingFallback";
import { DeleteRequestModal, NewRequestModal, RequestDetailsModal, RequestsTable } from "../lazy/requestComponents";

const label = (value: string) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
const metrics: { key: keyof Summary; label: string }[] = [
  { key: "total", label: "Total" },
  { key: "open", label: "Open" },
  { key: "inProgress", label: "In progress" },
  { key: "resolved", label: "Resolved" },
  { key: "highPriority", label: "High priority" },
  { key: "overdue", label: "Overdue" },
];

export function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const admin = user?.role === ROLES.ADMIN;
  const [meta, setMeta] = useState<Meta | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [selected, setSelected] = useState<ServiceRequest | null>(null);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const [nextSummary, nextRequests] = await Promise.all([
      requestsApi.summary(),
      requestsApi.list({
        status: status || undefined,
        priority: priority || undefined,
      }),
    ]);
    setSummary(nextSummary);
    setRequests(nextRequests);
  }, [status, priority]);

  useEffect(() => {
    let active = true;
    setError("");
    Promise.all([
      requestsApi.meta(),
      requestsApi.summary(),
    ])
      .then(([nextMeta, nextSummary]) => {
        if (!active) return;
        setMeta(nextMeta);
        setSummary(nextSummary);
      })
      .catch((cause) => {
        if (active) setError((cause as Error).message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setFiltering(true);
    requestsApi.list({
      status: status || undefined,
      priority: priority || undefined,
    })
      .then((nextRequests) => {
        if (active) setRequests(nextRequests);
      })
      .catch((cause) => {
        if (active) setError((cause as Error).message);
      })
      .finally(() => {
        if (active) setFiltering(false);
      });
    return () => {
      active = false;
    };
  }, [status, priority]);

  async function mutate(action: () => Promise<unknown>, message: string) {
    setSaving(true);
    setError("");
    try {
      await action();
      setCreating(false);
      setEditing(false);
      setSelected(null);
      toast.success(message);
      await refresh();
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    signOut();
    navigate("/login", { replace: true });
  }
  async function remove() {
    if (!selected) return;
    const id = selected.id;
    setSaving(true);
    setError("");
    try {
      await requestsApi.remove(id);
      setConfirmingDelete(false);
      setSelected(null);
      setEditing(false);
      toast.success("Request deleted.");
      await refresh();
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">

            <div>
              <p className="font-bold text-blue-950"> Service Request Management System</p>
              
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.name}</span>
            <button className="button-secondary" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Dashboard
            </p>
            <h1 className="mt-1 text-3xl font-bold text-blue-950">
              {admin ? "All service requests" : "My service requests"}
            </h1>
          </div>
          {!admin && (
            <button
              className="button"
              disabled={!meta || loading}
              onClick={() => {
                setError("");
                setCreating(true);
                setSelected(null);
                setEditing(false);
              }}
            >
              New request
            </button>
          )}
        </div>
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-white p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}
        {loading ? (
          <div className="card text-sm text-slate-600">Loading requests…</div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {metrics.map(({ key, label: metricLabel }) => (
                <div className="card" key={key}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    {metricLabel}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-blue-950">
                    {summary?.[key] ?? 0}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Last overdue check:{" "}
              {summary?.lastOverdueCheck
                ? new Date(summary.lastOverdueCheck).toLocaleString()
                : "Not run yet"}
            </p>
            <section className="card overflow-hidden p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 px-4 py-3 sm:flex-nowrap">
                <h2 className="text-lg font-bold text-blue-950">Requests <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 align-middle text-xs font-semibold text-blue-800">{requests.length}</span></h2>
                <div className="flex flex-nowrap items-center gap-2 whitespace-nowrap sm:justify-end">
                  <label className="sr-only" htmlFor="status-filter">Status</label>
                    <select
                      id="status-filter"
                      className="field !h-8 !w-28 !px-2 !py-1 !text-xs"
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                    >
                      <option value="">All statuses</option>
                      {meta?.statuses.map((value) => (
                        <option key={value} value={value}>{label(value)}</option>
                      ))}
                    </select>
                  <label className="sr-only" htmlFor="priority-filter">Priority</label>
                    <select
                      id="priority-filter"
                      className="field !h-8 !w-28 !px-2 !py-1 !text-xs"
                      value={priority}
                      onChange={(event) => setPriority(event.target.value)}
                    >
                      <option value="">All priorities</option>
                      {meta?.priorities.map((value) => (
                        <option key={value} value={value}>{label(value)}</option>
                      ))}
                    </select>
                  <button type="button" className="button-secondary !h-8 !px-2 !py-1 !text-xs" disabled={!status && !priority} onClick={() => { setStatus(""); setPriority(""); }}>Clear</button>
                </div>
              </div>
              {filtering ? (
                <RequestLoading />
              ) : (
                <Suspense fallback={<RequestLoading />}>
                  <RequestsTable
                    requests={requests}
                    admin={admin}
                    onSelect={(request) => {
                      setError("");
                      setSelected(request);
                      setCreating(false);
                      setEditing(false);
                    }}
                  />
                </Suspense>
              )}
            </section>
          </>
        )}
      </main>
      <Suspense fallback={<DialogLoading />}>
        {!admin && creating && meta && (
          <NewRequestModal
            meta={meta}
            saving={saving}
            error={error}
            onSubmit={async (fields: RequestFields) =>
              mutate(() => requestsApi.create(fields), "Request created.")
            }
            onClose={() => setCreating(false)}
          />
        )}
        {selected && meta && (
          <RequestDetailsModal
            request={selected}
            meta={meta}
            admin={admin}
            editing={editing}
            saving={saving}
            error={error}
            onClose={() => { setSelected(null); setEditing(false); setConfirmingDelete(false); setError(""); }}
            onEdit={() => { setError(""); setEditing(true); }}
            onCancelEdit={() => setEditing(false)}
            onSave={async (fields) => mutate(() => requestsApi.update(selected.id, fields), "Request updated.")}
            onStatusChange={async (nextStatus) => mutate(() => requestsApi.status(selected.id, nextStatus), "Status updated.")}
            onDelete={() => { setError(""); setConfirmingDelete(true); }}
          />
        )}
        {confirmingDelete && selected && (
          <DeleteRequestModal
            requestTitle={selected.title}
            saving={saving}
            error={error}
            onClose={() => { setConfirmingDelete(false); setError(""); }}
            onConfirm={remove}
          />
        )}
      </Suspense>
    </div>
  );
}
