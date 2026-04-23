import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const GTM_ID = "GTM-KFR5Z8BD";
const CLARITY_ID = "w2hgz3m500";
let gtmLoaded = false;
let clarityLoaded = false;

function injectScript(src: string): void {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function runWhenIdle(task: () => void, timeoutMs: number): void {
  const idle = (window as any).requestIdleCallback as
    | ((cb: () => void, opts?: { timeout: number }) => number)
    | undefined;
  if (idle) {
    idle(task, { timeout: timeoutMs });
    return;
  }
  window.setTimeout(task, timeoutMs);
}

function loadGtm(): void {
  if (typeof window === "undefined" || gtmLoaded) return;
  gtmLoaded = true;
  const w = window as any;
  if (!w.dataLayer) w.dataLayer = [];
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  injectScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
}

function loadClarity(): void {
  if (typeof window === "undefined" || clarityLoaded) return;
  clarityLoaded = true;
  const w = window as any;
  if (!w.clarity) {
    w.clarity = function (...args: any[]) {
      (w.clarity.q = w.clarity.q || []).push(args);
    };
  }
  injectScript(`https://www.clarity.ms/tag/${CLARITY_ID}`);
}

function scheduleTrackingLoad(): void {
  const onEngagement = () => {
    runWhenIdle(loadGtm, 800);
    runWhenIdle(loadClarity, 3500);
    detach();
  };
  const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart", "scroll"];
  const detach = () => {
    for (const evt of events) {
      window.removeEventListener(evt, onEngagement);
    }
  };
  for (const evt of events) {
    window.addEventListener(evt, onEngagement, { once: true, passive: true });
  }

  const run = () => {
    // Hybrid toward 90+: prefer interaction-triggered loading.
    // Fallback still ensures scripts load for passive visitors.
    window.setTimeout(loadGtm, 5000);
    // Session replay is non-critical; delay further to protect mobile TBT.
    window.setTimeout(() => {
      loadClarity();
      detach();
    }, 15000);
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
