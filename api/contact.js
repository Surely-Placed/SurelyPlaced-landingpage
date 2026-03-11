const nodemailer = require("nodemailer");

// Request body shape
/**
 * @typedef {Object} Body
 * @property {string} [name]
 * @property {string} [email]
 * @property {string} [phone]
 * @property {string} [subject]
 * @property {string} [message]
 * @property {string} [company] Honeypot field – bots fill this
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

    // Honeypot: if filled, pretend success without sending email
    if (body.company && body.company.trim().length > 0) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ ok: true }));
    }

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const subject = (body.subject || "").trim();
    const message = (body.message || "").trim();

    if (name.length < 2) {
      return jsonError(res, 400, "Invalid name");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError(res, 400, "Invalid email");
    }
    if (subject.length < 2) {
      return jsonError(res, 400, "Invalid subject");
    }
    if (message.length < 10) {
      return jsonError(res, 400, "Invalid message");
    }

    const to = getEnv("CONTACT_EMAIL_TO");
    const user = getEnv("CONTACT_EMAIL_USER");
    const pass = getEnv("CONTACT_EMAIL_PASS");
    const fromName = process.env.CONTACT_EMAIL_FROM_NAME || "SSG Job Consultants";

    if (!to || !user || !pass) {
      return jsonError(
        res,
        500,
        "Email service is not configured. Please set CONTACT_EMAIL_TO/USER/PASS in your environment.",
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    const safeSubject = `[SSG Website] ${subject}`.slice(0, 180);
    const text = [
      "New contact form submission",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      "",
      `Subject: ${subject}`,
      "",
      "Message:",
      message,
      "",
      `Time: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join("\n");

    const html = `
      <div style="background:#020617;padding:32px 16px;">
        <div style="max-width:720px;margin:0 auto;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;">
          <!-- Card -->
          <div style="border-radius:28px;overflow:hidden;background:radial-gradient(circle at top left,#0f766e 0,#0f172a 40%,#020617 100%);box-shadow:0 22px 45px rgba(15,23,42,0.55);">
            <!-- Header strip -->
            <div style="padding:20px 24px 18px;border-bottom:1px solid rgba(148,163,184,0.18);background:linear-gradient(120deg,rgba(16,185,129,0.18),rgba(56,189,248,0.12),rgba(15,23,42,0.9));display:flex;align-items:center;justify-content:space-between;">
              <div>
                <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#a5f3fc;font-weight:700;">SSG Job Consultants</div>
                <div style="margin-top:6px;font-size:21px;line-height:1.25;font-weight:650;color:#e5f1ff;">
                  New candidate enquiry
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="display:inline-flex;width:8px;height:8px;border-radius:999px;background:#22c55e;box-shadow:0 0 0 6px rgba(34,197,94,0.2);"></span>
                <span style="font-size:11px;color:#bbf7d0;">Lead captured</span>
              </div>
            </div>

            <!-- Body -->
            <div style="padding:20px 24px 22px;background:linear-gradient(180deg,rgba(15,23,42,0.97),#020617 100%);">
              <!-- Summary pill -->
              <div style="margin-bottom:16px;display:inline-flex;align-items:center;gap:8px;padding:6px 11px;border-radius:999px;background:rgba(15,23,42,0.9);border:1px solid rgba(148,163,184,0.45);">
                <div style="width:20px;height:20px;border-radius:999px;background:conic-gradient(from 180deg at 50% 50%,#22c55e,#0ea5e9,#6366f1,#22c55e);display:flex;align-items:center;justify-content:center;">
                  <span style="width:12px;height:12px;border-radius:999px;background:#020617;border:1px solid rgba(148,163,184,0.65);"></span>
                </div>
                <div style="font-size:11px;color:#e5e7eb;">
                  New student / candidate shared their goals via the SurelyPlaced landing page.
                </div>
              </div>

              <!-- Grid -->
              <table style="width:100%;border-collapse:separate;border-spacing:0 8px;margin-bottom:10px;">
                <tr>
                  <td style="width:36%;padding:10px 12px 8px;border-radius:14px 0 0 14px;background:rgba(15,23,42,0.9);border:1px solid rgba(148,163,184,0.4);border-right:none;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.12em;">
                    Name
                  </td>
                  <td style="padding:10px 14px 8px;border-radius:0 14px 14px 0;background:rgba(15,23,42,0.9);border:1px solid rgba(148,163,184,0.4);font-size:14px;color:#e5e7eb;font-weight:600;">
                    ${escapeHtml(name)}
                  </td>
                </tr>
                <tr>
                  <td style="width:36%;padding:10px 12px 8px;border-radius:14px 0 0 14px;background:rgba(15,23,42,0.9);border:1px solid rgba(148,163,184,0.36);border-right:none;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.12em;">
                    Email
                  </td>
                  <td style="padding:10px 14px 8px;border-radius:0 14px 14px 0;background:rgba(15,23,42,0.9);border:1px solid rgba(148,163,184,0.36);font-size:13px;color:#bfdbfe;">
                    <a href="mailto:${escapeHtml(
                      email,
                    )}" style="color:#60a5fa;text-decoration:none;">${escapeHtml(email)}</a>
                  </td>
                </tr>
                ${
                  phone
                    ? `
                <tr>
                  <td style="width:36%;padding:10px 12px 8px;border-radius:14px 0 0 14px;background:rgba(15,23,42,0.9);border:1px solid rgba(148,163,184,0.32);border-right:none;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.12em;">
                    Phone
                  </td>
                  <td style="padding:10px 14px 8px;border-radius:0 14px 14px 0;background:rgba(15,23,42,0.9);border:1px solid rgba(148,163,184,0.32);font-size:13px;color:#e5e7eb;">
                    ${escapeHtml(phone)}
                  </td>
                </tr>
              `
                    : ""
                }
                <tr>
                  <td style="width:36%;padding:10px 12px 8px;border-radius:14px 0 0 14px;background:rgba(15,23,42,0.9);border:1px solid rgba(148,163,184,0.32);border-right:none;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.12em;">
                    Subject
                  </td>
                  <td style="padding:10px 14px 8px;border-radius:0 14px 14px 0;background:rgba(15,23,42,0.9);border:1px solid rgba(148,163,184,0.32);font-size:13px;color:#e5e7eb;">
                    ${escapeHtml(subject)}
                  </td>
                </tr>
              </table>

              <!-- Message block -->
              <div style="margin-top:18px;">
                <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#9ca3af;font-weight:700;">
                  Target roles & timeline
                </div>
                <div style="margin-top:8px;border-radius:18px;background:radial-gradient(circle at top left,rgba(56,189,248,0.22),rgba(15,23,42,0.96));border:1px solid rgba(148,163,184,0.5);padding:14px 15px;box-shadow:0 14px 28px rgba(15,23,42,0.6);font-size:13px;color:#e5e7eb;white-space:pre-wrap;line-height:1.6;">
                  ${escapeHtml(message)}
                </div>
              </div>

              <!-- Footer meta -->
              <div style="margin-top:18px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#9ca3af;">
                <span>Received: ${new Date().toLocaleString()}</span>
                <span style="opacity:0.8;">SurelyPlaced · Landing page form</span>
              </div>
            </div>
          </div>

          <!-- Tiny footer -->
          <div style="margin-top:10px;text-align:center;font-size:10px;color:#6b7280;">
            You&apos;re receiving this email because a visitor submitted the consultation form on the SurelyPlaced site.
          </div>
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        to,
        from: `${fromName} <${user}>`,
        replyTo: email,
        subject: safeSubject,
        text,
        html,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Email send failed:", err);
      return jsonError(
        res,
        500,
        "Email send failed",
        err instanceof Error ? err.message : String(err),
      );
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Unhandled error in contact handler:", err);
    return jsonError(res, 500, "Failed to send message");
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

