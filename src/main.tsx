import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const GTM_ID = "GTM-KFR5Z8BD";
const CLARITY_ID = "w2hgz3m500";

function injectScript(src: string): void {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function loadTrackingScripts(): void {
  if (typeof window === "undefined") return;
  // Avoid blocking first paint in mobile webviews.
  if (!(window as any).dataLayer) {
    (window as any).dataLayer = [];
  }
  (window as any).dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  injectScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);

  const w = window as any;
  if (!w.clarity) {
    w.clarity = function (...args: any[]) {
      (w.clarity.q = w.clarity.q || []).push(args);
    };
  }
  injectScript(`https://www.clarity.ms/tag/${CLARITY_ID}`);
}

function scheduleTrackingLoad(): void {
  const run = () => {
    const idle = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined;
    if (idle) {
      idle(loadTrackingScripts, { timeout: 4000 });
      return;
    }
    window.setTimeout(loadTrackingScripts, 2500);
  };
  if (document.readyState === "complete") {
    run();
  } else {
    window.addEventListener("load", run, { once: true });
  }
}

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
scheduleTrackingLoad();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
