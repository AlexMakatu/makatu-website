// Shared Zoho Creator integration used by /api/quote and /api/chat-quote.
// Moved verbatim from app/api/quote/route.ts (behaviour unchanged).

export type Vehicle = {
  vehicleType: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleCondition?: string;
};

export type QuoteRequestBody = {
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


export function formatZohoDateForUI(date: Date): string {
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


export async function getZohoAccessToken(): Promise<string> {
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


export async function sendToZoho(data: QuoteRequestBody) {
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
// MAPPERS
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
