import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { sendToZoho, type QuoteRequestBody } from "@/lib/zohoCreator";
import {
  esc,
  row,
  fullQuoteHtml,
  sendNotificationEmail,
} from "@/lib/quoteEmail";

// Webhook for the Zoho SalesIQ Zobot ("Website chat" quotes).
// Auth: header `x-chat-quote-secret` must equal process.env.CHAT_QUOTE_SECRET.
// Zoho Creator has no "source" field, so the source is written into Notes.

export const dynamic = "force-dynamic";

const SOURCE = "Website chat";
const OK_MESSAGE =
  "Thanks! Your quote request is in. Our team will contact you shortly.";
const FAIL_MESSAGE =
  "Sorry, we couldn't save your quote request right now. Please try again in a moment, or WhatsApp/call us.";

const VEHICLE_TYPES = ["hatchback", "sedan", "suv", "bakkie", "van", "luxury", "other"];

function str(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : typeof v === "number" ? String(v) : "";
}

function secretOk(provided: string | null): boolean {
  const expected = process.env.CHAT_QUOTE_SECRET;
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Accepts YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY or anything Date can parse. */
function parseDate(input: string): Date | null {
  if (!input) return null;
  const dmy = input.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  const d = dmy ? new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1])) : new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(req: Request) {
  if (!secretOk(req.headers.get("x-chat-quote-secret"))) {
    return bad("Unauthorized", 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body");
  }

  const fullName = str(body.fullName, 120);
  const phone = str(body.phone, 30);
  const email = str(body.email, 160);
  const fromCity = str(body.fromCity, 80);
  const toCity = str(body.toCity, 80);
  const vehicleMake = str(body.vehicleMake, 60);
  const vehicleModel = str(body.vehicleModel, 60);
  const vehicleTypeRaw = str(body.vehicleType, 40).toLowerCase();
  const collectionDateRaw = str(body.collectionDate, 40);
  const notes = str(body.notes, 2000);

  const errors: string[] = [];
  if (fullName.length < 2) errors.push("full name");
  if (phone.replace(/\D/g, "").length < 9) errors.push("a valid phone number");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("a valid email (or leave it blank)");
  if (!fromCity) errors.push("collection city");
  if (!toCity) errors.push("delivery city");
  if (errors.length) return bad(`Please provide ${errors.join(", ")}.`);

  const vehicleType = VEHICLE_TYPES.includes(vehicleTypeRaw) ? vehicleTypeRaw : "other";
  const collectionDate = parseDate(collectionDateRaw);
  const ref = `CHAT-${Date.now().toString(36).toUpperCase()}`;

  const noteLines = [
    `Source: ${SOURCE}`,
    vehicleTypeRaw && vehicleType === "other" ? `Vehicle type (as typed): ${vehicleTypeRaw}` : "",
    collectionDateRaw && !collectionDate ? `Collection date (as typed): ${collectionDateRaw}` : "",
    notes,
  ].filter(Boolean);

  const data: QuoteRequestBody = {
    fullName,
    email,
    phone,
    customerType: "private",
    fromCity,
    toCity,
    transportType: "doorToDoor",
    collectionDateType: collectionDate ? "specificDate" : "flexible",
    ...(collectionDate && { collectionDate: collectionDate.toISOString() }),
    quotedPriceType: "quoteRequired",
    notes: noteLines.join("\n"),
    vehicles: [{ vehicleType, vehicleMake, vehicleModel }],
    submissionId: ref,
  };

  let zohoOk = true;
  let zohoError = "";
  try {
    await sendToZoho(data);
  } catch (err) {
    zohoOk = false;
    zohoError = String(err);
    console.error("chat-quote Zoho error:", err);
  }

  let emailOk = true;
  try {
    if (zohoOk) {
      await sendNotificationEmail(
        "New Quote Request (Website chat)",
        `
          <h2>New Quote Request (Website chat)</h2>
          <table>
            ${row("Reference", ref)}
            ${row("Name", fullName)}
            ${row("Email", email)}
            ${row("Phone", phone)}
            ${row("From", fromCity)}
            ${row("To", toCity)}
          </table>
          <hr />
          <p><strong>Zoho Status:</strong> saved</p>
        `,
      );
    } else {
      await sendNotificationEmail(
        "⚠️ Chat quote request NOT in Zoho - enter manually",
        `
          <h2>⚠️ This chat quote was NOT saved in Zoho</h2>
          <p>Please enter it into Zoho manually. This email is the only copy.</p>
          ${fullQuoteHtml(data, new Date().toISOString())}
          <hr />
          <p><strong>Zoho error:</strong> ${esc(zohoError)}</p>
        `,
      );
    }
  } catch (err) {
    emailOk = false;
    console.error("chat-quote email failed:", err);
  }

  if (!zohoOk && !emailOk) {
    return NextResponse.json({ ok: false, message: FAIL_MESSAGE }, { status: 500 });
  }
  return NextResponse.json({ ok: true, message: OK_MESSAGE, reference: ref });
}
