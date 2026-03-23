import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const vehicle = searchParams.get("vehicle");

  if (!from || !to || !vehicle) {
    return NextResponse.json({});
  }

  const rate = await client.fetch(
    groq`*[_type == "routeRate" &&
      fromCity == $from &&
      toCity == $to &&
      vehicleType == $vehicle
    ][0]{
      priceType,
      price
    }`,
    {
      from,
      to,
      vehicle,
    },
  );

  return NextResponse.json(rate || {});
}
