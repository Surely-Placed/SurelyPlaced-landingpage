import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useLeadForm, type Toast } from "./controllers/useLeadForm";
import { LandingPage } from "./pages/LandingPage";
import { ThankYouPage } from "./pages/ThankYouPage";
import { ToastContainer } from "./components/ui/Toast";

function App() {
  const navigate = useNavigate();
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
      navigate("/thank-you");
    },
    onError: pushToast,
  });
  const leadForm = useLeadForm({
    onSuccess: (toast) => {
      pushToast(toast);
      navigate("/thank-you");
    },
    onError: pushToast,
  });

  const handleReset = () => {
    heroForm.reset();
    leadForm.reset();
    navigate("/");
  };

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <Routes>
        <Route
          path="/"
          element={
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
          }
        />
        <Route
          path="/thank-you"
          element={<ThankYouPage onBack={handleReset} />}
        />
      </Routes>
    </>
  );
}

export default App;

