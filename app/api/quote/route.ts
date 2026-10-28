import { NextResponse } from "next/server";
import {
  sendToZoho,
  type QuoteRequestBody,
} from "@/lib/zohoCreator";
import {
  esc,
  fullQuoteHtml,
  sendNotificationEmail,
} from "@/lib/quoteEmail";

// Quotes are NOT stored in Sanity any more (the dataset is public).
// Zoho is the record; if Zoho fails, the email carries the full quote.

// =====================
// DUPLICATE GUARD (best effort, per server instance)
// =====================
const DUPLICATE_TTL_MS = 10 * 60 * 1000;
const recentSubmissions = new Map<string, number>();

function isDuplicate(id: string): boolean {
  const now = Date.now();
  for (const [key, ts] of recentSubmissions) {
    if (now - ts > DUPLICATE_TTL_MS) recentSubmissions.delete(key);
  }
  if (recentSubmissions.has(id)) return true;
  recentSubmissions.set(id, now);
  return false;
}

// =====================
// MAIN API HANDLER
// =====================
export async function POST(req: Request) {
  try {
    const data: QuoteRequestBody = await req.json();

    if (!data.fullName || !data.email || !data.fromCity || !data.toCity) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const submissionId =
      typeof data.submissionId === "string" && data.submissionId.trim()
        ? data.submissionId.trim().slice(0, 100)
        : undefined;
    data.submissionId = submissionId;

    if (submissionId && isDuplicate(submissionId)) {
      console.warn("Duplicate quote submission ignored:", submissionId);
      return NextResponse.json({ success: true, duplicate: true });
    }

    const submittedAt = new Date().toISOString();

    // =====================
    // ZOHO (main record)
    // =====================
    let zohoOk = true;
    let zohoError = "";

    try {
      await sendToZoho(data);
    } catch (err) {
      zohoOk = false;
      zohoError = String(err);
      console.error("Zoho error:", err);
    }

    // =====================
    // EMAIL (short if Zoho worked, full backup if not)
    // =====================
    let emailOk = true;
    try {
      // Zoho saved it: Creator sends its own alert, so no website email (avoids duplicates).
      if (!zohoOk) {
        await sendNotificationEmail(
          "⚠️ Quote request NOT in Zoho - enter manually",
          `
            <h2>⚠️ This quote was NOT saved in Zoho</h2>
            <p>Please enter it into Zoho manually. This email is the only copy.</p>
            ${fullQuoteHtml(data, submittedAt)}
            <hr />
            <p><strong>Zoho error:</strong> ${esc(zohoError)}</p>
          `,
        );
      }
    } catch (emailErr) {
      emailOk = false;
      console.error("Email failed:", emailErr);
    }

    if (!zohoOk && !emailOk) {
      // Allow the customer to retry with the same reference.
      if (submissionId) recentSubmissions.delete(submissionId);
      return NextResponse.json(
        {
          success: false,
          message:
            "Sorry, we couldn't send your quote request. Please try again in a moment, or call us.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Sorry, we couldn't send your quote request. Please try again in a moment, or call us.",
      },
      { status: 500 },
    );
  }
}

