import { useCallback, useState } from "react";

const buildToast = (input) => ({
  id: crypto.randomUUID(),
  type: input.type || "info",
  title: input.title || "Update",
  message: input.message || "",
  duration: input.duration || 3500
});

export default function useToasts() {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((input) => {
    const toast = buildToast(input);
    setToasts((prev) => [...prev, toast].slice(-4));
    return toast.id;
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, push, remove };
}
