import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await client.fetch(groq`
    *[_type == "vehicleTransportPage"][0].vehicleTypes[]{
      title
    }
  `);

  return NextResponse.json(data || []);
}
