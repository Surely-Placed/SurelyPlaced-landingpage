/**
 * LinkedIn / Facebook in-app browsers and older mobile WebViews sometimes reject
 * `behavior: "smooth"` on scrollIntoView; avoid throwing so the UI keeps working.
 */
export function scrollToElementById(sectionId: string): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(sectionId);
  if (!el) return;
  try {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch {
    try {
      el.scrollIntoView({ block: "start" });
    } catch {
      /* ignore */
    }
  }
}
