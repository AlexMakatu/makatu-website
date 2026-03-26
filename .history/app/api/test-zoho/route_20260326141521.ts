import { NextResponse } from "next/server";

export async function GET() {
  console.log("🔥 TEST ZOHO ROUTE HIT");

  const url = `https://creator.zoho.com/api/v2/${process.env.ZOHO_OWNER}/${process.env.ZOHO_APP}/form/${process.env.ZOHO_FORM}`;

  const payload = {
    data: {
      Full_Name: "Test User",
      Email: "test@example.com",
      Phone_Number: "0820000000",
      Customer_Type: "Private",

      From_City: "Johannesburg",
      To_City: "Cape Town",
      Transport_Type: "Door to Door",

      Collection_Date_Type: "Flexible",

      Price_Type: "Fixed",
      Quoted_Price: 5000,

      Notes: "Zoho test submission",
      Status: "New",

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
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${process.env.ZOHO_TOKEN}`,
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

// ✅ HELPER: Zoho date format
function formatZohoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
