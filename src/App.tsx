import { useEffect, useState } from "react";
import { syncUtmFromCurrentUrl } from "./lib/utm";
import { useLeadForm, type Toast } from "./controllers/useLeadForm";
import { LandingPage } from "./pages/LandingPage";
import { ThankYouPage } from "./pages/ThankYouPage";
import { ToastContainer } from "./components/ui/Toast";

function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [submitted, setSubmitted] = useState(
    typeof window !== "undefined" && window.location.hash === "#/thankyou",
  );

  const pushToast = (toast: Toast) => {
    // Always show only the latest toast
    setToasts([toast]);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    syncUtmFromCurrentUrl();
    const onUrlChange = () => syncUtmFromCurrentUrl();
    window.addEventListener("hashchange", onUrlChange);
    window.addEventListener("popstate", onUrlChange);
    return () => {
      window.removeEventListener("hashchange", onUrlChange);
      window.removeEventListener("popstate", onUrlChange);
    };
  }, []);

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
      setSubmitted(true);
      window.location.hash = "#/thankyou";
    },
    onError: pushToast,
  });
  const handleReset = () => {
    heroForm.reset();
    setSubmitted(false);
    window.location.hash = "#/";
  };

  // Keep UI in sync if user lands directly on /#/thankyou or /#/
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === "#/thankyou") {
        setSubmitted(true);
      } else if (window.location.hash === "#/" || window.location.hash === "" || window.location.hash === "#home") {
        setSubmitted(false);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

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
        />
      )}
    </>
  );
}

export default App;

