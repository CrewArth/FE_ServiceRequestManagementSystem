import { useEffect, useRef } from 'react';
import type { Meta, RequestFields } from '../../common/types/api.types';
import { RequestForm } from '../../components/RequestForm';

type NewRequestModalProps = {
  meta: Meta;
  saving: boolean;
  error: string;
  onSubmit: (fields: RequestFields) => Promise<void>;
  onClose: () => void;
};

export function NewRequestModal({ meta, saving, error, onSubmit, onClose }: NewRequestModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      previousFocus?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="new-request-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!saving) onClose();
      }}
      className="w-[calc(100%-2rem)] max-h-[90vh] max-w-xl overflow-y-auto rounded-lg border border-blue-100 bg-white p-6 shadow-xl backdrop:bg-blue-950/50 sm:p-8"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Employee request</p>
          <h2 id="new-request-title" className="mt-1 text-xl font-bold text-blue-950">New request</h2>
        </div>
        <button
          type="button"
          className="rounded-md px-2 py-1 text-xl leading-none text-slate-500 hover:bg-blue-50 hover:text-blue-900 disabled:opacity-50"
          aria-label="Close new request"
          disabled={saving}
          onClick={onClose}
        >
          ×
        </button>
      </div>
      {error && <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <RequestForm meta={meta} saving={saving} onSubmit={onSubmit} onCancel={() => { if (!saving) onClose(); }} />
    </dialog>
  );
}
