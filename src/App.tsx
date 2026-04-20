import { useEffect, useState } from "react";
import { syncUtmFromCurrentUrl } from "./lib/utm";
import { useLeadForm, type Toast } from "./controllers/useLeadForm";
import { LandingPage } from "./pages/LandingPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ThankYouPage } from "./pages/ThankYouPage";
import { ToastContainer } from "./components/ui/Toast";

type AppRoute = "landing" | "thankyou" | "privacy";

function routeFromLocation(): AppRoute {
  if (typeof window === "undefined") return "landing";
  if (window.location.pathname === "/privacy") return "privacy";
  const h = window.location.hash;
  if (h === "#/thankyou") return "thankyou";
  return "landing";
}

function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [route, setRoute] = useState<AppRoute>(routeFromLocation);

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
    const onLocationChange = () => setRoute(routeFromLocation());
    window.addEventListener("popstate", onLocationChange);
    window.addEventListener("hashchange", onLocationChange);
    return () => {
      window.removeEventListener("popstate", onLocationChange);
      window.removeEventListener("hashchange", onLocationChange);
    };
  }, []);

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      {route === "privacy" ? (
        <PrivacyPage />
      ) : route === "thankyou" ? (
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

