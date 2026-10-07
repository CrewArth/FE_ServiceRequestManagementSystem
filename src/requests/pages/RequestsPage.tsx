import { Suspense, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../auth/AuthContext';
import { ROLES } from '../../common/constants/roles';
import type { Meta, RequestFields, ServiceRequest } from '../../common/types/api.types';
import { DialogLoading, RequestLoading } from '../../lazy/LoadingFallback';
import { DeleteRequestModal, NewRequestModal, RequestDetailsModal, RequestsTable } from '../../lazy/requestComponents';
import { requestsApi } from '../../utils/api';
import { PageHeader } from '../../common/components/PageHeader';
import { EmptyState } from '../../common/components/EmptyState';
import { requestLabel } from '../components/RequestBadge';

export function RequestsPage() {
  const { user } = useAuth();
  const admin = user?.role === ROLES.ADMIN;
  const [meta, setMeta] = useState<Meta | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [selected, setSelected] = useState<ServiceRequest | null>(null);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [listError, setListError] = useState(false);

  const refresh = useCallback(async () => {
    setRequests(await requestsApi.list({
      status: status || undefined,
      priority: priority || undefined,
    }));
  }, [status, priority]);

  useEffect(() => {
    let active = true;
    requestsApi.meta()
      .then((value) => { if (active) setMeta(value); })
      .catch(() => { if (active) setError('Unable to load request options. Please refresh the page.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setFiltering(true);
    setListError(false);
    requestsApi.list({ status: status || undefined, priority: priority || undefined })
      .then((value) => { if (active) setRequests(value); })
      .catch(() => { if (active) setListError(true); })
      .finally(() => { if (active) setFiltering(false); });
    return () => { active = false; };
  }, [status, priority]);

  async function mutate(action: () => Promise<unknown>, message: string) {
    setSaving(true);
    setError('');
    try {
      await action();
      setCreating(false);
      setEditing(false);
      setSelected(null);
      toast.success(message);
      await refresh();
    } catch {
      setError('Unable to save the request. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!selected) return;
    const id = selected.id;
    setSaving(true);
    setError('');
    try {
      await requestsApi.remove(id);
      setConfirmingDelete(false);
      setSelected(null);
      setEditing(false);
      toast.success('Request deleted successfully.');
      await refresh();
    } catch {
      setError('Unable to delete the request. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Requests" description="Create, track, and manage service requests." action={!admin && (
          <button type="button" className="button" disabled={!meta || loading} onClick={() => {
            setError('');
            setCreating(true);
            setSelected(null);
            setEditing(false);
          }}>+ New request</button>
        )} />

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-white p-4 text-sm text-red-700">{error}</div>}
      {loading ? (
        <div role="status" className="card space-y-4"><div className="h-5 w-32 animate-pulse rounded bg-blue-100" /><div className="h-12 animate-pulse rounded bg-blue-50" /><div className="h-12 animate-pulse rounded bg-blue-50" /><div className="h-12 animate-pulse rounded bg-blue-50" /></div>
      ) : (
        <section className="card overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 overflow-x-auto border-b border-blue-100 px-4 py-3 sm:flex-nowrap">
            <div><h2 className="text-lg font-bold text-blue-950">Request list <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 align-middle text-xs font-semibold text-blue-800">{requests.length}</span></h2><p className="text-xs text-slate-500"></p></div>
            <div className="flex flex-nowrap items-center gap-2 whitespace-nowrap sm:justify-end">
              <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" /></svg>
              <label className="text-xs font-medium text-slate-600" htmlFor="status-filter">Status</label>
              <select id="status-filter" className={`field !h-8 !w-28 !px-2 !py-1 !text-xs ${status ? '!border-blue-500 !bg-blue-50' : ''}`} value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="">All statuses</option>
                {meta?.statuses.map((value) => <option key={value} value={value}>{requestLabel(value)}</option>)}
              </select>
              <label className="text-xs font-medium text-slate-600" htmlFor="priority-filter">Priority</label>
              <select id="priority-filter" className={`field !h-8 !w-28 !px-2 !py-1 !text-xs ${priority ? '!border-blue-500 !bg-blue-50' : ''}`} value={priority} onChange={(event) => setPriority(event.target.value)}>
                <option value="">All priorities</option>
                {meta?.priorities.map((value) => <option key={value} value={value}>{requestLabel(value)}</option>)}
              </select>
              <button type="button" className="button-secondary !h-8 !px-2 !py-1 !text-xs" disabled={!status && !priority} onClick={() => { setStatus(''); setPriority(''); }}>Clear filters</button>
            </div>
          </div>
          {(status || priority) && <p className="border-b border-blue-100 px-4 py-2 text-xs font-medium text-blue-800">Active filters: {[status && `Status: ${requestLabel(status)}`, priority && `Priority: ${requestLabel(priority)}`].filter(Boolean).join(' · ')}</p>}
          {filtering ? <RequestLoading /> : listError ? <EmptyState title="We couldn't load your requests" description="Please try again." action={<button type="button" className="button-secondary" onClick={() => { setFiltering(true); void refresh().then(() => setListError(false)).catch(() => setListError(true)).finally(() => setFiltering(false)); }}>Try again</button>} /> : (
            <Suspense fallback={<RequestLoading />}>
              <RequestsTable requests={requests} admin={admin} filtered={Boolean(status || priority)} onClear={() => { setStatus(''); setPriority(''); }} onCreate={() => setCreating(true)} onSelect={(request) => {
                setError('');
                setSelected(request);
                setCreating(false);
                setEditing(false);
              }} />
            </Suspense>
          )}
        </section>
      )}

      <Suspense fallback={<DialogLoading />}>
        {!admin && creating && meta && (
          <NewRequestModal meta={meta} saving={saving} error={error}
            onSubmit={async (fields: RequestFields) => mutate(() => requestsApi.create(fields), 'Request created successfully.')}
            onClose={() => setCreating(false)} />
        )}
        {selected && meta && (
          <RequestDetailsModal request={selected} meta={meta} admin={admin} editing={editing} saving={saving} error={error}
            onClose={() => { setSelected(null); setEditing(false); setConfirmingDelete(false); setError(''); }}
            onEdit={() => { setError(''); setEditing(true); }}
            onCancelEdit={() => setEditing(false)}
            onSave={async (fields) => mutate(() => requestsApi.update(selected.id, fields), 'Request updated successfully.')}
            onStatusChange={async (nextStatus) => mutate(() => requestsApi.status(selected.id, nextStatus), 'Status updated successfully.')}
            onDelete={() => { setError(''); setConfirmingDelete(true); }} />
        )}
        {confirmingDelete && selected && (
          <DeleteRequestModal requestTitle={selected.title} saving={saving} error={error}
            onClose={() => { setConfirmingDelete(false); setError(''); }} onConfirm={remove} />
        )}
      </Suspense>
    </div>
  );
}
