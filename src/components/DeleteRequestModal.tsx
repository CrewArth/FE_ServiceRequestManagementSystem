import { useEffect, useRef } from 'react';

type DeleteRequestModalProps = {
  requestTitle: string;
  saving: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function DeleteRequestModal({ requestTitle, saving, error, onClose, onConfirm }: DeleteRequestModalProps) {
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
      aria-labelledby="delete-request-title"
      aria-describedby="delete-request-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!saving) onClose();
      }}
      className="w-[calc(100%-2rem)] max-w-md rounded-lg border border-blue-100 bg-white p-6 shadow-xl backdrop:bg-blue-950/50"
    >
      <h2 id="delete-request-title" className="text-xl font-bold text-blue-950">Delete request?</h2>
      <p id="delete-request-description" className="mt-3 break-words text-sm leading-6 text-slate-700">
        Are you sure you want to delete <span className="font-semibold">{requestTitle}</span>? This action cannot be undone.
      </p>
      {error && <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" className="button-secondary" disabled={saving} onClick={onClose}>Cancel</button>
        <button type="button" className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800 disabled:opacity-50" disabled={saving} onClick={() => void onConfirm()}>
          {saving ? 'Deleting…' : 'Delete request'}
        </button>
      </div>
    </dialog>
  );
}
