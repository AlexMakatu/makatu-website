import { NextResponse } from "next/server";

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
    console.error("❌ Zoho refresh failed:", data);
    throw new Error("Failed to refresh Zoho token");
  }

  return data.access_token;
}

// =====================
// TEST ROUTE
// =====================
export async function GET() {
  console.log("🔥 TEST ZOHO ROUTE HIT");

  const url = `https://creator.zoho.com/api/v2/${process.env.ZOHO_OWNER}/${process.env.ZOHO_APP}/form/${process.env.ZOHO_FORM}`;

  const payload = {
    data: {
      Full_Name: "Test User",
      Email: "mdel2kita@gmail.com",
      Phone_Number: "0820000000",
      Customer_Type: "Private",

      From_City: "Johannesburg",
      To_City: "Cape Town",
      Transport_Type: "Door to Door",

      Collection_Date_Type: "Flexible",
      Collection_Date: "2026-04-03",

      Price_Type: "Fixed",
      Quoted_Price: 5000,

      Notes: "Zoho test submission",
      Status: "New",

      // ✅ REQUIRED FORMAT FOR ZOHO
      Submitted_At: formatZohoDateForUI(new Date()),

      // 🚗 SUBFORM
      Vehicles: [
        {
          Vehicle_Type: "Sedan",
          Vehicle_Make: "Toyota",
          Vehicle_Model: "Corolla",
          Vehicle_Year: "2020",
          Vehicle_Condition: "Runner",
        },
      ],
    },
  };

  console.log("📤 Sending to Zoho:", JSON.stringify(payload, null, 2));

  try {
    // ✅ USE REFRESH TOKEN FLOW
    const accessToken = await getZohoAccessToken();

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
    console.log("📥 Raw response:", text);

    return NextResponse.json({
      status: res.status,
      response: text,
    });
  } catch (error) {
    console.error("❌ ERROR:", error);

    return NextResponse.json({
      error: String(error),
    });
  }
}

// =====================
// DATE FORMATTER (Zoho)
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
