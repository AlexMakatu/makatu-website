import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

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
// SANITY CLIENT
// =====================
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

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
      vehicles: data.vehicles || [],
    };

    const sanityResult = await client.create(sanityDoc);

    // =====================
    // SEND TO ZOHO (async)
    // =====================
    sendToZoho(data).catch((err) => {
      console.error("Zoho error:", err);
    });

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
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
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
  const url = `https://creator.zoho.com/api/v2/${process.env.ZOHO_OWNER}/${process.env.ZOHO_APP}/form/${process.env.ZOHO_FORM}`;

  const accessToken = await getZohoAccessToken();

  const payload = {
    data: {
      Full_Name: data.fullName,
      Email: data.email,
      Phone_Number: data.phone,
      Customer_Type: mapCustomerType(data.customerType),

      From_City: data.fromCity,
      To_City: data.toCity,
      Transport_Type: mapTransportType(data.transportType),

      Collection_Date_Type: mapCollectionType(data.collectionDateType),
      Collection_Date: data.collectionDate,

      Price_Type: mapPriceType(data.quotedPriceType),
      Quoted_Price: data.quotedPrice,
      Price_To_Beat: data.priceToBeat,

      Notes: data.notes || "",
      Status: "New",

      // ✅ CORRECT DATE FORMAT (YYYY-MM-DD)
      Submitted_At: formatZohoDateOnly(new Date()),

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
// DATE FORMATTER
// =====================
function formatZohoDateOnly(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

// =====================
// VALUE MAPPERS
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
