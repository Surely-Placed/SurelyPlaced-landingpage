/**
 * Paste into the Apps Script project attached to your Google Sheet
 * (Extensions → Apps Script). Deploy → New deployment → Web app:
 *   Execute as: Me
 *   Who has access: Anyone  ← required for server POSTs (no Google login); not "Only myself"
 * After any code change: Deploy → Manage deployments → ✎ on the Web app → Version "New version" → Deploy.
 * Copy the Web app URL (ends with /exec) into GOOGLE_APPS_SCRIPT_URL.
 * External clients: POST once to that URL, then follow the 302 with GET (POST again → 405).
 *
 * Sheet row 1 headers (Sheet1): Submitted at | Name | email | phone | university | current_role | targeted_role | utm_source
 *
 * WEBHOOK_SECRET below must match GOOGLE_APPS_SCRIPT_SECRET on your server.
 * If this file is in a public repo, rotate this secret and update both places.
 */

// Must match GOOGLE_APPS_SCRIPT_SECRET in Vercel / .env (same string as POST body field "secret").
const WEBHOOK_SECRET =
  "d6875585ec89516540525080b6e857946eefff5af58a8b2977bbcca9581859d9";

function doPost(e) {
  const out = ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);

  try {
    if (!e.postData || !e.postData.contents) {
      out.setContent(JSON.stringify({ ok: false, error: "No body" }));
      return out;
    }

    const data = JSON.parse(e.postData.contents);

    if (WEBHOOK_SECRET && data.secret !== WEBHOOK_SECRET) {
      out.setContent(JSON.stringify({ ok: false, error: "Unauthorized" }));
      return out;
    }

    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1") ||
      SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.college || "",
      data.current_role || data.role || "",
      data.targeted_role || "",
      data.utm_source || "direct",
    ]);

    out.setContent(JSON.stringify({ ok: true }));
    return out;
  } catch (err) {
    out.setContent(
      JSON.stringify({
        ok: false,
        error: String(err && err.message ? err.message : err),
      }),
    );
    return out;
  }
}
