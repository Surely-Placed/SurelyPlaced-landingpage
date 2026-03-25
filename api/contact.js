// Forwards validated leads to a Google Apps Script Web App (doPost) that appends
// rows to your sheet. No GCP credentials or googleapis on this server.

const path = require("node:path");
const fs = require("node:fs");

// This file is imported from vite.config.ts before that file runs `dotenv.config()`,
// so load repo `.env` here using `__dirname` (always `…/api`, never a Vite temp path).
(function loadRepoDotenv() {
  const hasUrl =
    (process.env.GOOGLE_APPS_SCRIPT_URL || "").trim() ||
    (process.env.FORM_WEBHOOK_URL || "").trim();
  if (hasUrl) return;
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
 * @property {string} [phone]
 * @property {string} [company] College / university (sheet: university)
 * @property {string} [current_role]
 * @property {string} [targeted_role] What roles they are targeting
 * @property {string} [utm_source] Marketing source (e.g. linkedin); default direct
 */

// Simple in-memory rate limit (best‑effort; resets on cold start)
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
    return { error: "GOOGLE_APPS_SCRIPT_URL is not a valid URL." };
  }
  let path = parsed.pathname.replace(/\/+$/, "");
  if (path.endsWith("/dev")) {
    path = `${path.slice(0, -4)}/exec`;
  }
  if (!path.endsWith("/exec")) {
    return {
      error:
        'GOOGLE_APPS_SCRIPT_URL must end with /exec. In Apps Script: Deploy → Manage deployments → copy the Web app URL from that deployment (it ends with /exec). Do not use a URL ending in /dev, /2, or the script editor link.',
    };
  }
  parsed.pathname = path;
  return { url: parsed.href };
}

/** Safe label for sheet; default direct when missing or invalid. */
function normalizeUtmSource(raw) {
  const t = String(raw ?? "").trim().slice(0, 120);
  if (!t) return "direct";
  const lower = t.toLowerCase();
  if (lower === "direct") return "direct";
  if (!/^[\w\-./+\s@%]+$/i.test(t)) return "direct";
  return t;
}

const MAX_SCRIPT_REDIRECTS = 8;

/**
 * Apps Script returns 302 from script.google.com → script.googleusercontent.com.
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
        " (often “Page not found”): GOOGLE_APPS_SCRIPT_URL is wrong or not a Web App deployment. " +
        'In Apps Script: Deploy → Manage deployments → under “Web app” copy the URL that ends with /exec only. ' +
        "URLs ending in /2 or /dev are not the Web App URL. Redeploy with Who has access: Anyone if needed."
      );
    }
    return (
      "Google returned an HTML page instead of running your script (HTTP " +
      status +
      "). In Apps Script: Deploy → Manage deployments → edit the Web app → set Who has access to Anyone, save, copy the new /exec URL into GOOGLE_APPS_SCRIPT_URL, then try again."
    );
  }
  return raw.slice(0, 200);
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

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    if (name.length < 2) {
      return jsonError(res, 400, "Invalid name");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError(res, 400, "Invalid email");
    }

    const college = (body.company || "").trim();
    const currentRole = (body.current_role || body.role || "").trim();
    const targetedRole = (body.targeted_role || "").trim();

    if (college.length < 2) {
      return jsonError(res, 400, "Invalid college / university");
    }
    if (phone.length < 6) {
      return jsonError(res, 400, "Invalid phone");
    }
    if (currentRole.length < 2) {
      return jsonError(res, 400, "Invalid current role");
    }
    if (targetedRole.length < 2) {
      return jsonError(res, 400, "Invalid targeted roles");
    }

    const rawScriptUrl =
      getEnv("GOOGLE_APPS_SCRIPT_URL") || getEnv("FORM_WEBHOOK_URL");
    if (!rawScriptUrl.trim()) {
      return jsonError(
        res,
        500,
        "GOOGLE_APPS_SCRIPT_URL is not set. Deploy a Web App from Google Apps Script and paste its URL (ends with /exec). See scripts/google-apps-script-append.gs in this repo.",
      );
    }
    const normalized = normalizeWebAppUrl(rawScriptUrl);
    if ("error" in normalized) {
      return jsonError(res, 400, normalized.error);
    }
    const scriptUrl = normalized.url;

    const utmSource = normalizeUtmSource(body.utm_source);

    const payload = {
      submittedAt: new Date().toISOString(),
      name,
      email,
      phone,
      college,
      current_role: currentRole,
      targeted_role: targetedRole,
      utm_source: utmSource,
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
          detailForAppsScriptFailure(upstream.status, text),
        );
      }
      if (looksLikeHtml(text)) {
        return jsonError(
          res,
          502,
          "Failed to save to sheet",
          detailForAppsScriptFailure(upstream.status, text),
        );
      }
      try {
        const parsed = JSON.parse(text);
        if (parsed && parsed.ok === false) {
          return jsonError(
            res,
            502,
            "Failed to save to sheet",
            String(parsed.error || "Sheet script error").slice(0, 200),
          );
        }
      } catch {
        /* non-JSON success body is OK for some deployments */
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
