import { useEffect, useRef, useState } from 'react';
import type { Meta, RequestFields, ServiceRequest } from '../common/types/api.types';
import { RequestBadge, requestLabel } from '../requests/components/RequestBadge';
import { RequestForm } from './RequestForm';

type RequestDetailsModalProps = {
  request: ServiceRequest;
  meta: Meta;
  admin: boolean;
  editing: boolean;
  saving: boolean;
  error: string;
  onClose: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (fields: RequestFields) => Promise<void>;
  onStatusChange: (status: string) => Promise<void>;
  onDelete: () => void;
};

export function RequestDetailsModal({ request, meta, admin, editing, saving, error, onClose, onEdit, onCancelEdit, onSave, onStatusChange, onDelete }: RequestDetailsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const canEdit = admin || request.status === 'OPEN';
  const [nextStatus, setNextStatus] = useState(request.status);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      previousFocus?.focus();
    };
  }, []);

  return <dialog
    ref={dialogRef}
    aria-labelledby="request-details-title"
    onCancel={(event) => {
      event.preventDefault();
      if (!saving) onClose();
    }}
    className="fixed left-1/2 top-1/2 m-0 w-[calc(100%-2rem)] max-h-[90vh] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-blue-100 bg-white p-6 shadow-xl backdrop:bg-blue-950/50 sm:p-8"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Request details</p>
        <h2 id="request-details-title" className="mt-1 break-words text-xl font-bold text-blue-950">{request.title}</h2>
        <div className="mt-3 flex flex-wrap gap-2"><RequestBadge value={request.status} kind="status" /><RequestBadge value={request.priority} kind="priority" /></div>
      </div>
      <button type="button" className="rounded-md px-2 py-1 text-xl leading-none text-slate-500 hover:bg-blue-50 hover:text-blue-900 disabled:opacity-50" aria-label="Close request details" disabled={saving} onClick={onClose}>×</button>
    </div>

    {error && <p role="alert" className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

    {editing ? <div className="mt-6"><RequestForm meta={meta} request={request} saving={saving} onSubmit={onSave} onCancel={() => { if (!saving) onCancelEdit(); }} /></div> : <>
      <section className="mt-6"><h3 className="text-sm font-semibold text-blue-950">Description</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{request.description}</p></section>
      <section className="mt-6 border-t border-blue-100 pt-5"><h3 className="text-sm font-semibold text-blue-950">Request information</h3><dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div><dt className="text-slate-500">Category</dt><dd className="mt-1 font-medium text-blue-950">{requestLabel(request.category)}</dd></div>
        <div><dt className="text-slate-500">Owner</dt><dd className="mt-1 font-medium text-blue-950">{request.owner.name}</dd></div>
        <div><dt className="text-slate-500">Created</dt><dd className="mt-1 font-medium text-blue-950">{new Date(request.createdAt).toLocaleString()}</dd></div>
        <div><dt className="text-slate-500">Updated</dt><dd className="mt-1 font-medium text-blue-950">{new Date(request.updatedAt).toLocaleString()}</dd></div>
        <div><dt className="text-slate-500">Overdue</dt><dd className="mt-1 font-medium text-blue-950">{request.overdue ? 'Yes' : 'No'}</dd></div>
      </dl></section>
      {admin && <section className="mt-6 border-t border-blue-100 pt-5"><h3 className="text-sm font-semibold text-blue-950">Change status</h3><p className="mt-2 text-xs text-slate-500">Current status: {requestLabel(request.status)}</p><div className="mt-2 flex flex-wrap items-end gap-2"><label className="block max-w-xs flex-1 text-sm font-medium text-blue-950">Change to
        <select className="field mt-1" value={nextStatus} disabled={saving} onChange={(event) => setNextStatus(event.target.value)}>
          {meta.statuses.map((value) => <option key={value} value={value}>{requestLabel(value)}</option>)}
        </select></label><button type="button" className="button" disabled={saving || nextStatus === request.status} onClick={() => void onStatusChange(nextStatus)}>Update status</button></div></section>}
      <div className="mt-6 flex flex-wrap gap-2 border-t border-blue-100 pt-5">
        {canEdit && <>
        <button type="button" className="button-secondary" disabled={saving} onClick={onEdit}>Edit</button>
        <button type="button" className="button-secondary text-red-700" disabled={saving} onClick={onDelete}>Delete</button>
        </>}
      </div>
    </>}
  </dialog>;
}
