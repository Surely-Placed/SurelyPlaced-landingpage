const IGNORE_REFERRER_UNTIL_UTM_KEY = "sp_utm_ignore_referrer";
const UTM_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_adset",
  "utm_content",
  "utm_term",
  "utm_placement",
] as const;
type UtmField = (typeof UTM_FIELDS)[number];
type UtmPayload = Record<UtmField, string>;
const STORAGE_KEY_BY_FIELD: Record<UtmField, string> = {
  utm_source: "sp_utm_source",
  utm_medium: "sp_utm_medium",
  utm_campaign: "sp_utm_campaign",
  utm_adset: "sp_utm_adset",
  utm_content: "sp_utm_content",
  utm_term: "sp_utm_term",
  utm_placement: "sp_utm_placement",
};

/** Query string from the main URL or from the hash (e.g. `/#/?utm_source=linkedin`). */
function getUtmParamsFromLocation(): Partial<UtmPayload> {
  const out: Partial<UtmPayload> = {};
  if (typeof window === "undefined") return out;
  const { search, hash } = window.location;
  const read = (params: URLSearchParams) => {
    for (const key of UTM_FIELDS) {
      const v = params.get(key);
      if (v != null && v.trim().length > 0) {
        out[key] = v.trim();
      }
    }
  };
  if (search.length > 1) {
    read(new URLSearchParams(search));
  }
  const q = hash.indexOf("?");
  if (q >= 0) {
    read(new URLSearchParams(hash.slice(q + 1)));
  }
  return out;
}

/** Sheet + analytics label: always `instagram`, never `ig`. */
function canonicalizeUtmSource(raw: string): string {
  const t = raw.trim();
  if (t.toLowerCase() === "ig") return "instagram";
  return t;
}

/**
 * Map document.referrer host to a short utm_source when the user did not use tagged links.
 * Referrer can be empty (privacy, HTTPS policies, in-app browsers) â€” then we fall back to "direct".
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
 * 1) `utm_*` in URL wins and is persisted.
 * 2) Else keep existing session values.
 * 3) Else infer only `utm_source` from referrer (if allowed).
 */
export function syncUtmFromCurrentUrl(): void {
  if (typeof window === "undefined") return;

  const fromUrl = getUtmParamsFromLocation();
  if (Object.keys(fromUrl).length > 0) {
    sessionStorage.removeItem(IGNORE_REFERRER_UNTIL_UTM_KEY);
    for (const key of UTM_FIELDS) {
      const raw = fromUrl[key];
      if (!raw) continue;
      const value = key === "utm_source" ? canonicalizeUtmSource(raw).slice(0, 120) : raw.slice(0, 180);
      sessionStorage.setItem(STORAGE_KEY_BY_FIELD[key], value);
    }
    return;
  }

  const hasExisting = UTM_FIELDS.some((key) => {
    const v = sessionStorage.getItem(STORAGE_KEY_BY_FIELD[key]);
    return v != null && v.trim().length > 0;
  });
  if (hasExisting) return;

  if (sessionStorage.getItem(IGNORE_REFERRER_UNTIL_UTM_KEY) === "1") return;

  const inferred = inferSourceFromReferrer();
  if (inferred != null) {
    sessionStorage.setItem(STORAGE_KEY_BY_FIELD.utm_source, canonicalizeUtmSource(inferred));
  }
}

/** Value for `utm_source`: URL utm, auto referrer, or "direct". */
export function getUtmSourceForSubmit(): string {
  if (typeof window === "undefined") return "direct";
  syncUtmFromCurrentUrl();
  const stored = sessionStorage.getItem(STORAGE_KEY_BY_FIELD.utm_source);
  if (stored != null && stored.trim().length > 0) {
    return canonicalizeUtmSource(stored);
  }
  return "direct";
}

/** All UTM fields for submit. Missing non-source fields are empty strings. */
export function getUtmFieldsForSubmit(): UtmPayload {
  if (typeof window === "undefined") {
    return {
      utm_source: "direct",
      utm_medium: "",
      utm_campaign: "",
      utm_adset: "",
      utm_content: "",
      utm_term: "",
      utm_placement: "",
    };
  }
  syncUtmFromCurrentUrl();
  const read = (key: UtmField) => {
    const v = sessionStorage.getItem(STORAGE_KEY_BY_FIELD[key]);
    return v != null && v.trim().length > 0 ? v.trim() : "";
  };
  return {
    utm_source: getUtmSourceForSubmit(),
    utm_medium: read("utm_medium"),
    utm_campaign: read("utm_campaign"),
    utm_adset: read("utm_adset"),
    utm_content: read("utm_content"),
    utm_term: read("utm_term"),
    utm_placement: read("utm_placement"),
  };
}

/**
 * Removes stored attribution and all `utm_*` params from the address bar so `sync` cannot
 * immediately refill from the URL. Sets a flag so referrer inference does not run again in
 * this tab until the user lands with explicit `utm_*` in the URL.
 */
export function clearStoredUtmSource(): void {
  if (typeof window === "undefined") return;
  try {
    for (const key of UTM_FIELDS) {
      sessionStorage.removeItem(STORAGE_KEY_BY_FIELD[key]);
    }
    sessionStorage.setItem(IGNORE_REFERRER_UNTIL_UTM_KEY, "1");
  } catch {
    /* ignore */
  }
  stripUtmParamsFromBrowserUrl();
}

/** Drop utm_* from `?query` and from `hash?query` without reloading. */
function stripUtmParamsFromBrowserUrl(): void {
  if (typeof window === "undefined") return;
  try {
    const u = new URL(window.location.href);
    let changed = false;
    for (const k of [...u.searchParams.keys()]) {
      if (k.toLowerCase().startsWith("utm_")) {
        u.searchParams.delete(k);
        changed = true;
      }
    }
    const hash = u.hash;
    const hqi = hash.indexOf("?");
    if (hqi >= 0) {
      const base = hash.slice(0, hqi);
      const hp = new URLSearchParams(hash.slice(hqi + 1));
      for (const k of [...hp.keys()]) {
        if (k.toLowerCase().startsWith("utm_")) {
          hp.delete(k);
          changed = true;
        }
      }
      const rest = hp.toString();
      u.hash = rest ? `${base}?${rest}` : base;
      changed = true;
    }
    if (changed) {
      window.history.replaceState(window.history.state, "", u.href);
    }
  } catch {
    /* ignore */
  }
}
