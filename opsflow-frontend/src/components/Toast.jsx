import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => onClose(toast.id), toast.duration || 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`toast ${toast.type || "info"}`} role="status">
      <div>
        <strong>{toast.title}</strong>
        {toast.message ? <p className="muted">{toast.message}</p> : null}
      </div>
      <button className="toast-close" onClick={() => onClose(toast.id)}>
        Close
      </button>
    </div>
  );
}
