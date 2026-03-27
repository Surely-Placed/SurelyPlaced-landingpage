import type { Toast as ToastType } from "../../controllers/useLeadForm";

type Props = {
  toasts: ToastType[];
  onDismiss: (id: number) => void;
};

export function ToastContainer({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-[70] flex justify-center px-4 sm:px-0">
      <div className="flex w-full max-w-md flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 text-sm shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-rose-50 text-rose-900 border border-rose-200"
            }`}
          >
            <div
              className={`mt-1 h-2 w-2 rounded-full ${
                toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            <div className="flex-1">{toast.message}</div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="ml-2 text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

