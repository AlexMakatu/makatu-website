import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
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
};

// =====================
// CLIENTS
// =====================
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const resend = new Resend(process.env.RESEND_API_KEY);

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
// EMAIL HELPER
// =====================
async function sendNotificationEmail(
  subject: string,
  html: string,
): Promise<void> {
  await resend.emails.send({
    from: "Makatu <onboarding@resend.dev>",
    to: ["alex@makatu.co.za"],
    subject,
    html,
  });
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

    // =====================
    // SAVE TO SANITY
    // =====================
    const sanityDoc = {
      _type: "quoteRequest",
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      customerType: data.customerType,
      fromCity: data.fromCity,
      toCity: data.toCity,
      transportType: data.transportType,
      collectionDateType: data.collectionDateType,
      collectionDate: data.collectionDate,
      quotedPriceType: data.quotedPriceType,
      quotedPrice: data.quotedPrice,
      priceToBeat: data.priceToBeat,
      notes: data.notes,
      submittedAt: new Date().toISOString(),
      status: "new",
      vehicles: (data.vehicles || []).map((v) => ({
        _key: crypto.randomUUID(),
        vehicleType: v.vehicleType,
        vehicleMake: v.vehicleMake,
        vehicleModel: v.vehicleModel,
        vehicleYear: v.vehicleYear,
        vehicleCondition: v.vehicleCondition,
      })),
    };

    const sanityResult = await client.create(sanityDoc);

    // =====================
    // ZOHO (AWAITED = FIX)
    // =====================
    let zohoStatus = "success";
    let zohoError = "";

    try {
      await sendToZoho(data);
    } catch (err) {
      zohoStatus = "failed";
      zohoError = String(err);
      console.error("Zoho error:", err);
    }

    // =====================
    // EMAIL (ALWAYS RUN)
    // =====================
    try {
      await sendNotificationEmail(
        zohoStatus === "success"
          ? "✅ New Quote Submitted"
          : "⚠️ Quote Submitted (Zoho Failed)",
        `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${data.fullName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>From:</strong> ${data.fromCity}</p>
          <p><strong>To:</strong> ${data.toCity}</p>

          <hr />

          <p><strong>Zoho Status:</strong> ${zohoStatus}</p>
          ${zohoError ? `<p><strong>Error:</strong> ${zohoError}</p>` : ""}
        `,
      );
    } catch (emailErr) {
      console.error("Email failed:", emailErr);
    }

    return NextResponse.json({ success: true, sanityResult });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
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
      Notes: data.notes || "",
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

  console.log("📤 Sending to Zoho:", JSON.stringify(payload, null, 2));

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
  console.log("📥 Response:", text);

  if (!res.ok) {
    throw new Error("Zoho API failed");
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
