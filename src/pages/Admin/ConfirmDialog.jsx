import { useEffect, useRef } from "react";

// Uses the native <dialog>: focus stays inside and Escape works out of the box
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel,
  busy = false,
  onConfirm,
  onCancel,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      aria-labelledby="confirm-title"
      onCancel={(e) => {
        e.preventDefault(); // we close it ourselves through the "open" prop
        if (!busy) onCancel();
      }}
      onClick={(e) => {
        // A click on the dark backdrop closes it
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <h2 id="confirm-title">{title}</h2>
      <div className="confirm-body">{children}</div>
      <div className="confirm-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
          {cancelLabel}
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy} aria-busy={busy}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}