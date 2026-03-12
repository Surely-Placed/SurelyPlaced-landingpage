import { useEffect, useState } from "react";
import { useLeadForm, type Toast } from "./controllers/useLeadForm";
import { LandingPage } from "./pages/LandingPage";
import { ThankYouPage } from "./pages/ThankYouPage";
import { ToastContainer } from "./components/ui/Toast";

function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (toast: Toast) => {
    // Always show only the latest toast
    setToasts([toast]);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auto-dismiss the latest toast after 5 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    const timer = setTimeout(() => {
      dismissToast(latest.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toasts]);

  const heroForm = useLeadForm({
    onSuccess: (toast) => {
      pushToast(toast);
      window.location.hash = "#thank-you";
    },
    onError: pushToast,
  });
  const leadForm = useLeadForm({
    onSuccess: (toast) => {
      pushToast(toast);
      window.location.hash = "#thank-you";
    },
    onError: pushToast,
  });

  const submitted = heroForm.submitted || leadForm.submitted;

  const handleReset = () => {
    heroForm.reset();
    leadForm.reset();
    window.location.hash = "#home";
  };

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      {submitted ? (
        <ThankYouPage onBack={handleReset} />
      ) : (
        <LandingPage
          heroForm={heroForm.form}
          heroSubmitting={heroForm.submitting}
          heroOnChange={heroForm.handleChange}
          heroOnSubmit={heroForm.handleSubmit}
          leadForm={leadForm.form}
          leadSubmitting={leadForm.submitting}
          leadOnChange={leadForm.handleChange}
          leadOnSubmit={leadForm.handleSubmit}
        />
      )}
    </>
  );
}

export default App;

