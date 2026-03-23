import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const doc = {
      _type: "quoteRequest",
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      fromCity: data.fromCity,
      toCity: data.toCity,
      notes: data.notes,
      submittedAt: data.submittedAt,
      status: "new",
      vehicles: data.vehicles || [],
    };

    const result = await client.create(doc);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
