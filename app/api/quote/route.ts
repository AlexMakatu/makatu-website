import { NextResponse } from "next/server";
import { Resend } from "resend";

// =====================
// TYPES
// =====================
type Vehicle = {
  vehicleType: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleCondition?: string;
};

type QuoteRequestBody = {
  fullName: string;
  email: string;
  phone: string;
  customerType?: string;
  fromCity: string;
  toCity: string;
  transportType?: string;
  collectionDateType?: string;
  collectionDate?: string;
  quotedPriceType?: string;
  quotedPrice?: number;
  priceToBeat?: number;
  notes?: string;
  vehicles: Vehicle[];
  submissionId?: string;
};

// =====================
// CLIENTS
// =====================
// Quotes are NOT stored in Sanity any more (the dataset is public).
// Zoho is the record; if Zoho fails, the email carries the full quote.
const resend = new Resend(process.env.RESEND_API_KEY);

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
// DATE FORMATTERS
// =====================
function formatZohoDateForUI(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// =====================
// EMAIL HELPERS
// =====================
function esc(value: unknown): string {
  if (value === undefined || value === null || value === "") return "-";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: unknown): string {
  return `<tr><td style="padding:4px 12px 4px 0;vertical-align:top"><strong>${esc(label)}</strong></td><td style="padding:4px 0;white-space:pre-wrap">${esc(value)}</td></tr>`;
}

function fullQuoteHtml(data: QuoteRequestBody, submittedAt: string): string {
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

async function sendNotificationEmail(
  subject: string,
  html: string,
): Promise<void> {
  const { error } = await resend.emails.send({
    from: "Makatu <onboarding@resend.dev>",
    to: ["quoteme@makatu.co.za"],
    subject,
    html,
  });
  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
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
      if (zohoOk) {
        await sendNotificationEmail(
          "✅ New Quote Submitted",
          `
            <h2>New Quote Request</h2>
            <table>
              ${row("Reference", submissionId)}
              ${row("Name", data.fullName)}
              ${row("Email", data.email)}
              ${row("Phone", data.phone)}
              ${row("From", data.fromCity)}
              ${row("To", data.toCity)}
            </table>
            <hr />
            <p><strong>Zoho Status:</strong> saved</p>
          `,
        );
      } else {
        await sendNotificationEmail(
          "⚠️ Quote NOT in Zoho - enter manually",
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

// =====================
// ZOHO TOKEN REFRESH
// =====================
async function getZohoAccessToken(): Promise<string> {
  const res = await fetch("https://accounts.zoho.com/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();

  if (!data.access_token) {
    console.error("Zoho refresh failed:", data);
    throw new Error("Failed to refresh Zoho token");
  }

  return data.access_token;
}

// =====================
// ZOHO INTEGRATION
// =====================
async function sendToZoho(data: QuoteRequestBody) {
  console.log("🚀 sendToZoho FUNCTION STARTED");

  const url = `https://creator.zoho.com/api/v2/${process.env.ZOHO_OWNER}/${process.env.ZOHO_APP}/form/${process.env.ZOHO_FORM}`;

  const accessToken = await getZohoAccessToken();

  const payload = {
    data: {
      Full_Name: data.fullName,
      Email: data.email,
      Phone_Number: data.phone,
      Customer_Type: mapCustomerType(data.customerType || "private"),
      From_City: data.fromCity,
      To_City: data.toCity,
      Transport_Type: mapTransportType(data.transportType || "doorToDoor"),
      Collection_Date_Type: mapCollectionType(
        data.collectionDateType || "flexible",
      ),
      ...(data.collectionDate && {
        Collection_Date: formatZohoDateForUI(new Date(data.collectionDate)),
      }),
      ...(data.quotedPriceType && {
        Price_Type: mapPriceType(data.quotedPriceType),
      }),
      ...(data.quotedPrice && { Quoted_Price: data.quotedPrice }),
      ...(data.priceToBeat && { Price_To_Beat: data.priceToBeat }),
      Notes: [data.notes, data.submissionId ? `Ref: ${data.submissionId}` : ""]
        .filter(Boolean)
        .join("\n\n"),
      Status: "New",
      Submitted_At: formatZohoDateForUI(new Date()),
      Vehicles: (data.vehicles || []).map((v) => ({
        Vehicle_Type: mapVehicleType(v.vehicleType),
        Vehicle_Make: v.vehicleMake || "",
        Vehicle_Model: v.vehicleModel || "",
        Vehicle_Year: v.vehicleYear || "",
        Vehicle_Condition: mapCondition(v.vehicleCondition),
      })),
    },
  };

  console.log("📤 Sending quote to Zoho", data.submissionId || "");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  console.log("📥 Status:", res.status);

  if (!res.ok) {
    throw new Error(`Zoho API failed (${res.status})`);
  }

  return text;
}

// =====================
// MAPPERS (UNCHANGED)
// =====================
function mapVehicleType(type?: string): string {
  const map: Record<string, string> = {
    hatchback: "Hatchback",
    sedan: "Sedan",
    suv: "SUV",
    bakkie: "Bakkie",
    van: "Van",
    luxury: "Luxury",
    other: "Other",
  };
  return map[type?.toLowerCase() || ""] || "";
}

function mapCondition(condition?: string): string {
  const map: Record<string, string> = {
    runner: "Runner",
    nonrunner: "Non-Runner",
    forklift: "Requires Forklift",
  };
  return map[condition?.toLowerCase() || ""] || "";
}

function mapTransportType(type?: string): string {
  const map: Record<string, string> = {
    doortodoor: "Door to Door",
    dealertodealer: "Dealer to Dealer",
    dealertoprivate: "Dealer to Private",
    privatetodealer: "Private to Dealer",
  };
  return map[type?.toLowerCase().replace(/\s/g, "") || ""] || "";
}

function mapCollectionType(type?: string): string {
  const map: Record<string, string> = {
    flexible: "Flexible",
    asap: "ASAP",
    specificdate: "Specific Date",
  };
  return map[type?.toLowerCase().replace(/\s/g, "") || ""] || "";
}

function mapPriceType(type?: string): string {
  const map: Record<string, string> = {
    fixed: "Fixed",
    startingfrom: "Starting From",
    negotiable: "Negotiable",
    quoterequired: "Quote Required",
  };
  return map[type?.toLowerCase().replace(/\s/g, "") || ""] || "";
}

function mapCustomerType(type?: string): string {
  const map: Record<string, string> = {
    private: "Private",
    dealership: "Dealer",
    dealer: "Dealer",
    fleet: "Fleet",
  };
  return map[type?.toLowerCase() || ""] || "";
}
