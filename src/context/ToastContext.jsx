import { useCallback, useMemo, useState } from "react";
import { ToastContext } from "./toast-context";
import { useTranslation } from "../hooks/useTranslation";

let nextId = 1;

export function ToastProvider({ children }) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);

  const dismiss = useCallback(
    (id) => setItems((list) => list.filter((item) => item.id !== id)),
    []
  );

  const push = useCallback(
    (type, text) => {
      const id = nextId++;
      setItems((list) => [...list, { id, type, text }]);
      setTimeout(() => dismiss(id), type === "error" ? 7000 : 4000);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      success: (text) => push("success", text),
      error: (text) => push("error", text),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {items.map((item) => (
          <div
            key={item.id}
            className={`toast ${item.type}`}
            role={item.type === "error" ? "alert" : "status"}
          >
            <span>{item.text}</span>
            <button type="button" onClick={() => dismiss(item.id)} aria-label={t("admin.common.close")}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}