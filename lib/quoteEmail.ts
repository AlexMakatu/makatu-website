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
      ${row("Price type", data.quotedPriceType)}
      ${row("Quoted price (incl. VAT)", data.quotedPrice)}
      ${row("Price to beat", data.priceToBeat)}
      ${row("Notes", data.notes)}
    </table>
    ${vehicles || "<p>No vehicles listed.</p>"}
  `;
}

export async function sendNotificationEmail(
  subject: string,
  html: string,
): Promise<void> {
  const { error } = await getResend().emails.send({
    from: "Makatu <onboarding@resend.dev>",
    to: ["quoteme@makatu.co.za"],
    subject,
    html,
  });
  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}

