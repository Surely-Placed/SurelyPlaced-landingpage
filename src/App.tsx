import { useState } from "react";
import { useLeadForm, type Toast } from "./controllers/useLeadForm";
import { LandingPage } from "./pages/LandingPage";
import { ThankYouPage } from "./pages/ThankYouPage";
import { ToastContainer } from "./components/ui/Toast";

function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const heroForm = useLeadForm({
    onSuccess: pushToast,
    onError: pushToast,
  });
  const leadForm = useLeadForm({
    onSuccess: pushToast,
    onError: pushToast,
  });

  const submitted = heroForm.submitted || leadForm.submitted;

  const handleReset = () => {
    heroForm.reset();
    leadForm.reset();
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

