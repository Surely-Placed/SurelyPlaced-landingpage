const STORAGE_KEY = "sp_utm_source";

/**
 * Query string from the main URL or from the hash (e.g. `/#/?utm_source=linkedin` has no `location.search`).
 * Local / prod: `http://localhost:5174/?utm_source=linkedin` or `.../?utm_source=linkedin#/home`
 */
function getUtmFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  const { search, hash } = window.location;
  if (search.length > 1) {
    const p = new URLSearchParams(search);
    const v = p.get("utm_source");
    if (v != null && v.trim().length > 0) return v.trim();
  }
  const q = hash.indexOf("?");
  if (q >= 0) {
    const p = new URLSearchParams(hash.slice(q + 1));
    const v = p.get("utm_source");
    if (v != null && v.trim().length > 0) return v.trim();
  }
  return null;
}

/**
 * Reads `utm_source` from the current URL and caches it for the tab session.
 * Works on localhost: open `http://localhost:5174/?utm_source=linkedin` (or hash form below), then submit the form.
 */
export function syncUtmFromCurrentUrl(): void {
  if (typeof window === "undefined") return;
  const raw = getUtmFromLocation();
  if (raw != null) {
    sessionStorage.setItem(STORAGE_KEY, raw.slice(0, 120));
  }
}

/**
 * Value to send with the lead form: last-touch from URL in this session, otherwise `"direct"`.
 */
export function getUtmSourceForSubmit(): string {
  if (typeof window === "undefined") return "direct";
  syncUtmFromCurrentUrl();
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored != null && stored.trim().length > 0) {
    return stored.trim();
  }
  return "direct";
}
