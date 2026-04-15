import { useEffect, useState } from "react";
import { syncUtmFromCurrentUrl } from "./lib/utm";
import { useLeadForm, type Toast } from "./controllers/useLeadForm";
import { LandingPage } from "./pages/LandingPage";
import { ThankYouPage } from "./pages/ThankYouPage";
import { ToastContainer } from "./components/ui/Toast";

type AppRoute = "landing" | "thankyou";

function routeFromHash(): AppRoute {
  if (typeof window === "undefined") return "landing";
  const h = window.location.hash;
  if (h === "#/thankyou") return "thankyou";
  return "landing";
}

function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [route, setRoute] = useState<AppRoute>(routeFromHash);

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
      window.location.hash = "#/thankyou";
    },
    onError: pushToast,
  });
  const handleReset = () => {
    heroForm.reset();
    if (typeof window !== "undefined") {
      const cleanUrl = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, "", cleanUrl);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setRoute("landing");
    }
  };

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      {route === "thankyou" ? (
        <ThankYouPage onBack={handleReset} />
      ) : (
        <LandingPage
          heroForm={heroForm.form}
          heroSubmitting={heroForm.submitting}
          heroOnChange={heroForm.handleChange}
          heroOnCountryCodeChange={heroForm.handleCountryCodeChange}
          heroOnWhatsappCountryCodeChange={heroForm.handleWhatsappCountryCodeChange}
          heroOnSubmit={heroForm.handleSubmit}
        />
      )}
    </>
  );
}

export default App;

