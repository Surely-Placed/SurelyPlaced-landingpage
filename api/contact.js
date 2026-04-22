// Forwards validated leads to a Google Apps Script Web App (doPost) that appends
// rows to your sheet. No GCP credentials or googleapis on this server.

const path = require("node:path");
const fs = require("node:fs");

// This file is imported from vite.config.ts before that file runs `dotenv.config()`,
// so merge repo `.env` here using `__dirname` (always `â€¦/api`, never a Vite temp path).
// Always load (no early exit): if GOOGLE_APPS_SCRIPT_URL is already set but
// GOOGLE_APPS_SCRIPT_URL_2 exists only in `.env`, skipping would drop the second URL.
(function loadRepoDotenv() {
  const root = path.join(__dirname, "..");
  const tryLoad = (name, override) => {
    const p = path.join(root, name);
    if (!fs.existsSync(p)) return;
    try {
      require("dotenv").config({ path: p, override: Boolean(override) });
    } catch {
      /* ignore */
    }
  };
  tryLoad(".env", false);
  tryLoad(".env.local", true);
})();

// Request body shape
/**
 * @typedef {Object} Body
 * @property {string} [name]
 * @property {string} [email]
 * @property {string} [country_code] E.164-style dial prefix, e.g. +1, +91
 * @property {string} [phone]
 * @property {string} [whatsapp_country_code]
 * @property {string} [whatsapp]
 * @property {string} [linkedin]
 * @property {string} [company] College / university (sheet: university)
 * @property {string} [current_role]
 * @property {string} [targeted_role] What roles they are targeting
 * @property {string} [utm_source]
 * @property {string} [utm_medium]
 * @property {string} [utm_campaign]
 * @property {string} [utm_adset]
 * @property {string} [utm_content]
 * @property {string} [utm_term]
 * @property {string} [utm_placement]
 */

// Simple in-memory rate limit (bestâ€‘effort; resets on cold start)
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // per IP per window

/** @type {Map<string, { count: number; resetAt: number }>} */
const hits = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfterMs: entry.resetAt - now };
  }
  entry.count += 1;
  return { ok: true };
}

function getEnv(name) {
  const v = process.env[name];
  return (v && v.trim()) || "";
}

/**
 * Web App URL must be the deployment URL ending in /exec (not /dev, /2, or editor links).
 * @param {string} raw
 * @returns {{ url: string } | { error: string }}
 */
function normalizeWebAppUrl(raw) {
  const trimmed = raw.replace(/\s+/g, "").trim();
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { error: "Apps Script Web App URL is not a valid URL." };
  }
  let path = parsed.pathname.replace(/\/+$/, "");
  if (path.endsWith("/dev")) {
    path = `${path.slice(0, -4)}/exec`;
  }
  if (!path.endsWith("/exec")) {
    return {
      error:
        'Each Apps Script URL must end with /exec. In Apps Script: Deploy â†’ Manage deployments â†’ copy the Web app URL from that deployment (it ends with /exec). Do not use a URL ending in /dev, /2, or the script editor link.',
    };
  }
  parsed.pathname = path;
  return { url: parsed.href };
}

/**
 * Multiple sheets: comma-separate URLs in GOOGLE_APPS_SCRIPT_URL and/or set GOOGLE_APPS_SCRIPT_URL_2.
 * @returns {string[]}
 */
function collectRawAppsScriptUrls() {
  const primary = getEnv("GOOGLE_APPS_SCRIPT_URL") || getEnv("FORM_WEBHOOK_URL");
  const secondary = getEnv("GOOGLE_APPS_SCRIPT_URL_2");
  /** @type {string[]} */
  const raw = [];
  if (primary) {
    for (const chunk of primary.split(",")) {
      const t = chunk.trim();
      if (t) raw.push(t);
    }
  }
  const s2 = secondary.trim();
  if (s2) raw.push(s2);
  return raw;
}

/** Safe label for sheet; default direct when missing or invalid. */
function normalizeUtmSource(raw) {
  const t = String(raw ?? "").trim().slice(0, 120);
  if (!t) return "direct";
  const lower = t.toLowerCase();
  if (lower === "direct") return "direct";
  if (lower === "ig") return "instagram";
  if (!/^[\w\-./+\s@%]+$/i.test(t)) return "direct";
  return t;
}

function normalizeUtmField(raw) {
  const t = String(raw ?? "").trim().slice(0, 180);
  if (!t) return "";
  if (!/^[\w\-./+\s@%]+$/i.test(t)) return "";
  return t;
}

function normalizeLinkedin(raw) {
  const t = String(raw ?? "").trim().slice(0, 220);
  if (!t) return "";
  // Accept full URL, @username, or plain username/profile slug.
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("@")) return t.slice(1);
  return t;
}

const MAX_SCRIPT_REDIRECTS = 8;

/**
 * Apps Script returns 302 from script.google.com â†’ script.googleusercontent.com.
 * The second URL only allows GET/HEAD (Allow: HEAD, GET). Re-POSTing causes HTTP 405.
 * Chrome follows 302 with GET; Google ties the original POST body to the redirect URL.
 * @see https://stackoverflow.com/questions/74878421/google-apps-script-return-405-for-post-request
 */
async function postToGoogleAppsScriptWebApp(startUrl, postHeaders, bodyStr) {
  const ua = postHeaders["User-Agent"] || "SurelyPlaced-Contact/1.0";
  const getHeaders = {
    Accept: "application/json, text/plain, */*",
    "User-Agent": ua,
  };

  let url = startUrl;
  let res = await fetch(url, {
    method: "POST",
    headers: postHeaders,
    body: bodyStr,
    redirect: "manual",
  });

  for (let hop = 0; hop < MAX_SCRIPT_REDIRECTS; hop++) {
    if (res.status < 300 || res.status >= 400) {
      return res;
    }
    const loc = res.headers.get("location");
    if (!loc) return res;
    const nextUrl = new URL(loc, url).href;
    await res.arrayBuffer().catch(() => {});
    url = nextUrl;
    res = await fetch(nextUrl, {
      method: "GET",
      redirect: "manual",
      headers: getHeaders,
    });
  }
  return new Response("Too many redirects from Apps Script", { status: 508 });
}

function looksLikeHtml(s) {
  const t = String(s || "").trimStart().toLowerCase();
  return t.startsWith("<!doctype") || t.startsWith("<html");
}

function detailForAppsScriptFailure(status, text) {
  const raw = String(text || "");
  const pageNotFound =
    /page not found/i.test(raw) || /<title>[^<]*not found/i.test(raw);
  if (looksLikeHtml(raw)) {
    if (status === 401 || pageNotFound) {
      return (
        "HTTP " +
        status +
        " (often â€œPage not foundâ€): GOOGLE_APPS_SCRIPT_URL is wrong or not a Web App deployment. " +
        'In Apps Script: Deploy â†’ Manage deployments â†’ under â€œWeb appâ€ copy the URL that ends with /exec only. ' +
        "URLs ending in /2 or /dev are not the Web App URL. Redeploy with Who has access: Anyone if needed."
      );
    }
    return (
      "Google returned an HTML page instead of running your script (HTTP " +
      status +
      "). In Apps Script: Deploy â†’ Manage deployments â†’ edit the Web app â†’ set Who has access to Anyone, save, copy the new /exec URL into GOOGLE_APPS_SCRIPT_URL, then try again."
    );
  }
  return raw.slice(0, 200);
}

function isDuplicateEmailError(parsed) {
  const code = String(parsed?.error || parsed?.code || "").trim().toUpperCase();
  return code === "DUPLICATE_EMAIL";
}

/**
 * Vercel Node.js API route handler (CommonJS)
 * @param {import('http').IncomingMessage & { body?: Body; method?: string; headers?: any; socket: any }} req
 * @param {import('http').ServerResponse} res
 */
async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ ok: false, error: "Method Not Allowed" }));
    }

    const ipHeader = /** @type {string|undefined} */ (req.headers["x-forwarded-for"]);
    const ip =
      (ipHeader && ipHeader.split(",")[0].trim()) ||
      req.socket?.remoteAddress ||
      "unknown";

    const rl = rateLimit(ip);
    if (!rl.ok) {
      res.statusCode = 429;
      res.setHeader("Retry-After", Math.ceil(rl.retryAfterMs / 1000).toString());
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({
          ok: false,
          error: "Too many requests. Please try again shortly.",
        }),
      );
    }

    /** @type {Body} */
    const body = (req.body || {});

    const normalizePhone10Digits = (raw, countryCode) => {
      let digits = String(raw || "").replace(/\D/g, "");
      const ccDigits = String(countryCode || "").replace(/\D/g, "");
      if (
        ccDigits &&
        digits.length === ccDigits.length + 10 &&
        digits.startsWith(ccDigits)
      ) {
        digits = digits.slice(ccDigits.length);
      }
      return digits.slice(0, 10);
    };

    const normalizeCountryCode = (raw) => {
      const cc = String(raw || "").trim();
      if (!cc) return "+1";
      // Allow any reasonable E.164 country calling prefix (libphonenumber uses up to 4 digits, rarely 5)
      if (!/^\+\d{1,6}$/.test(cc)) return "+1";
      return cc;
    };

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const countryCode = normalizeCountryCode(body.country_code);
    const phoneDigits = normalizePhone10Digits(body.phone, countryCode);
    if (name.length < 2) {
      return jsonError(res, 400, "Invalid name");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError(res, 400, "Invalid email");
    }

    const college = (body.company || "").trim();
    const whatsappCountryCode = normalizeCountryCode(body.whatsapp_country_code);
    const whatsappDigits = normalizePhone10Digits(body.whatsapp, whatsappCountryCode);
    const linkedin = normalizeLinkedin(body.linkedin);
    const currentRole = (body.current_role || body.role || "").trim();
    const targetedRole = (body.targeted_role || "").trim();

    if (college.length < 2) {
      return jsonError(res, 400, "Invalid college / university");
    }
    if (phoneDigits.length !== 10) {
      return jsonError(res, 400, "Invalid phone (10 digits required)");
    }
    if (String(body.whatsapp || "").trim() && whatsappDigits.length !== 10) {
      return jsonError(res, 400, "Invalid WhatsApp number (10 digits required)");
    }
    if (currentRole.length < 2) {
      return jsonError(res, 400, "Invalid current role");
    }
    if (targetedRole.length < 2) {
      return jsonError(res, 400, "Invalid targeted roles");
    }

    const rawUrls = collectRawAppsScriptUrls();
    if (rawUrls.length === 0) {
      return jsonError(
        res,
        500,
        "No Apps Script URLs configured. Set GOOGLE_APPS_SCRIPT_URL (and optionally GOOGLE_APPS_SCRIPT_URL_2 for a second sheet). URLs must end with /exec. See scripts/google-apps-script-append.gs.",
      );
    }
    /** @type {string[]} */
    const scriptUrls = [];
    const seen = new Set();
    for (const rawOne of rawUrls) {
      const normalized = normalizeWebAppUrl(rawOne);
      if ("error" in normalized) {
        return jsonError(res, 400, normalized.error);
      }
      if (!seen.has(normalized.url)) {
        seen.add(normalized.url);
        scriptUrls.push(normalized.url);
      }
    }

    const utmSource = normalizeUtmSource(body.utm_source);
    const utmMedium = normalizeUtmField(body.utm_medium);
    const utmCampaign = normalizeUtmField(body.utm_campaign);
    const utmAdset = normalizeUtmField(body.utm_adset);
    const utmContent = normalizeUtmField(body.utm_content);
    const utmTerm = normalizeUtmField(body.utm_term);
    const utmPlacement = normalizeUtmField(body.utm_placement);

    const payload = {
      submittedAt: new Date().toISOString(),
      name,
      email,
      phone: `${countryCode} ${phoneDigits}`,
      whatsapp: whatsappDigits ? `${whatsappCountryCode} ${whatsappDigits}` : "",
      linkedin,
      college,
      current_role: currentRole,
      targeted_role: targetedRole,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_adset: utmAdset,
      utm_content: utmContent,
      utm_term: utmTerm,
      utm_placement: utmPlacement,
    };
    const scriptSecret =
      getEnv("GOOGLE_APPS_SCRIPT_SECRET") || getEnv("FORM_WEBHOOK_SECRET");
    if (scriptSecret) {
      payload.secret = scriptSecret;
    }

    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json, text/plain, */*",
      "User-Agent": "SurelyPlaced-Contact/1.0",
    };
    const bodyStr = JSON.stringify(payload);

    try {
      for (let u = 0; u < scriptUrls.length; u++) {
        const scriptUrl = scriptUrls[u];
        const upstream = await postToGoogleAppsScriptWebApp(
          scriptUrl,
          headers,
          bodyStr,
        );
        const text = await upstream.text();
        if (!upstream.ok) {
          return jsonError(
            res,
            502,
            "Failed to save to sheet",
            scriptUrls.length > 1
              ? `${detailForAppsScriptFailure(upstream.status, text)} (destination ${u + 1}/${scriptUrls.length})`
              : detailForAppsScriptFailure(upstream.status, text),
          );
        }
        if (looksLikeHtml(text)) {
          return jsonError(
            res,
            502,
            "Failed to save to sheet",
            scriptUrls.length > 1
              ? `${detailForAppsScriptFailure(upstream.status, text)} (destination ${u + 1}/${scriptUrls.length})`
              : detailForAppsScriptFailure(upstream.status, text),
          );
        }
        try {
          const parsed = JSON.parse(text);
          if (parsed && parsed.ok === false) {
            if (isDuplicateEmailError(parsed)) {
              return jsonError(res, 409, "You already filled this form.");
            }
            return jsonError(
              res,
              502,
              "Failed to save to sheet",
              scriptUrls.length > 1
                ? `${String(parsed.error || "Sheet script error").slice(0, 200)} (destination ${u + 1}/${scriptUrls.length})`
                : String(parsed.error || "Sheet script error").slice(0, 200),
            );
          }
        } catch {
          /* non-JSON success body is OK for some deployments */
        }
      }
    } catch (e) {
      return jsonError(
        res,
        502,
        "Failed to save to sheet",
        e instanceof Error ? e.message : String(e),
      );
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ ok: true }));
  } catch {
    return jsonError(res, 500, "Failed to save submission");
  }
}

function jsonError(res, status, error, detail) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify(
      detail
        ? {
            ok: false,
            error,
            detail,
          }
        : {
            ok: false,
            error,
          },
    ),
  );
}

module.exports = handler;

