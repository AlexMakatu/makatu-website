import { Resend } from "resend";
import type { QuoteRequestBody } from "@/lib/zohoCreator";

// Shared quote notification email (moved from app/api/quote/route.ts).
let resend: Resend | null = null;
function getResend(): Resend {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export function esc(value: unknown): string {
  if (value === undefined || value === null || value === "") return "-";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function row(label: string, value: unknown): string {
  return `<tr><td style="padding:4px 12px 4px 0;vertical-align:top"><strong>${esc(label)}</strong></td><td style="padding:4px 0;white-space:pre-wrap">${esc(value)}</td></tr>`;
}

export const QUOTE_REQUEST_NOTICE =
  "This is a quote REQUEST. Any price shown is the indicative website estimate only, not a confirmed quote. Please prepare and send the formal quote.";

/** The website only ever shows indicative estimates, so never label them as a fixed price. */
function estimateTypeLabel(type?: string): string {
  if (!type) return "";
  const t = type.toLowerCase().replace(/\s/g, "");
  if (t === "quoterequired") return "No website estimate (quote required)";
  return "Indicative website estimate";
}

export function fullQuoteHtml(data: QuoteRequestBody, submittedAt: string): string {
  const vehicles = (data.vehicles || [])
    .map(
      (v, i) => `
        <h4>Vehicle ${i + 1}</h4>
        <table>
          ${row("Type", v.vehicleType)}
          ${row("Make", v.vehicleMake)}
          ${row("Model", v.vehicleModel)}
          ${row("Year", v.vehicleYear)}
          ${row("Condition", v.vehicleCondition)}
        </table>`,
    )
    .join("");

  return `
    <table>
      ${row("Reference", data.submissionId)}
      ${row("Submitted at", submittedAt)}
      ${row("Name", data.fullName)}
      ${row("Email", data.email)}
      ${row("Phone", data.phone)}
      ${row("Customer type", data.customerType)}
      ${row("From", data.fromCity)}
      ${row("To", data.toCity)}
      ${row("Transport type", data.transportType)}
      ${row("Collection date type", data.collectionDateType)}
      ${row("Collection date", data.collectionDate)}
      ${row("Estimate type", estimateTypeLabel(data.quotedPriceType))}
      ${row("Indicative website estimate (incl. VAT)", data.quotedPrice)}
      ${row("Price to beat", data.priceToBeat)}
      ${row("Notes", data.notes)}
    </table>
    ${vehicles || "<p>No vehicles listed.</p>"}
  `;
}

const QUOTE_TO = ["quoteme@makatu.co.za"];
// Internal notification sender. resend.dev test sender only delivers to the Resend account owner.
const FROM = process.env.RESEND_FROM || "Makatu <noreply@makatu.co.za>";
const QUOTE_CC = ["quotesmakatu@gmail.com"];

export async function sendNotificationEmail(
  subject: string,
  html: string,
): Promise<void> {
  const body = {
    from: FROM,
    to: QUOTE_TO,
    subject,
    html: `<p style="padding:8px 12px;background:#fff4e5;border:1px solid #f0b46c"><strong>${esc(QUOTE_REQUEST_NOTICE)}</strong></p>${html}`,
  };
  const { error } = await getResend().emails.send({ ...body, cc: QUOTE_CC });
  if (!error) return;
  // Never lose the notification because of the CC (e.g. Resend test-sender restrictions):
  // retry once to the main inbox only.
  console.error("Resend rejected email with CC, retrying without CC:", error.name, error.message);
  const retry = await getResend().emails.send(body);
  if (retry.error) {
    console.error("Resend rejected notification email:", retry.error.name, retry.error.message);
    throw new Error(`Resend error: ${retry.error.message}`);
  }
}
