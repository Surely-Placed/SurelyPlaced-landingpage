const STORAGE_KEY = "sp_utm_source";

/**
 * Query string from the main URL or from the hash (e.g. `/#/?utm_source=linkedin`).
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

/** Sheet + analytics label: always `instagram`, never `ig`. */
function canonicalizeUtmSource(raw: string): string {
  const t = raw.trim();
  if (t.toLowerCase() === "ig") return "instagram";
  return t;
}

/**
 * Map document.referrer host to a short utm_source when the user did not use tagged links.
 * Referrer can be empty (privacy, HTTPS policies, in-app browsers) — then we fall back to "direct".
 */
function inferSourceFromReferrer(): string | null {
  if (typeof document === "undefined") return null;
  const ref = document.referrer;
  if (!ref) return null;
  try {
    const host = new URL(ref).hostname.toLowerCase().replace(/^www\./, "");

    const exact: Record<string, string> = {
      "linkedin.com": "linkedin",
      "lnkd.in": "linkedin",
      "facebook.com": "facebook",
      "m.facebook.com": "facebook",
      "l.facebook.com": "facebook",
      "fb.com": "facebook",
      "instagram.com": "instagram",
      "m.instagram.com": "instagram",
      "l.instagram.com": "instagram",
      "help.instagram.com": "instagram",
      "twitter.com": "twitter",
      "x.com": "twitter",
      "t.co": "twitter",
      "reddit.com": "reddit",
      "youtube.com": "youtube",
      "bing.com": "bing",
      "tiktok.com": "tiktok",
      "whatsapp.com": "whatsapp",
      "ig.me": "instagram",
    };

    if (exact[host]) return exact[host];

    if (host.endsWith(".linkedin.com")) return "linkedin";
    if (host.endsWith(".facebook.com")) return "facebook";
    if (host === "instagram.com" || host.endsWith(".instagram.com")) return "instagram";
    if (host.endsWith(".google.com") || host === "google.com") return "google";

    return null;
  } catch {
    return null;
  }
}

/**
 * 1) `?utm_source=` in the URL wins (manual campaigns / overrides).
 * 2) Else, first visit in this tab: infer from `document.referrer` (e.g. LinkedIn → linkedin).
 * 3) Else keep existing session value so refresh / in-app navigation does not drop attribution.
 */
export function syncUtmFromCurrentUrl(): void {
  if (typeof window === "undefined") return;

  const fromUrl = getUtmFromLocation();
  if (fromUrl != null) {
    sessionStorage.setItem(
      STORAGE_KEY,
      canonicalizeUtmSource(fromUrl).slice(0, 120),
    );
    return;
  }

  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing != null && existing.trim().length > 0) {
    return;
  }

  const inferred = inferSourceFromReferrer();
  if (inferred != null) {
    sessionStorage.setItem(STORAGE_KEY, canonicalizeUtmSource(inferred));
  }
}

/**
 * Value for the lead form: URL utm, auto referrer, or "direct".
 */
export function getUtmSourceForSubmit(): string {
  if (typeof window === "undefined") return "direct";
  syncUtmFromCurrentUrl();
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored != null && stored.trim().length > 0) {
    return canonicalizeUtmSource(stored);
  }
  return "direct";
}

/** Call after a successful lead submit so the next visit / submission does not reuse attribution. */
export function clearStoredUtmSource(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
