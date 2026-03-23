import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const vehicle = searchParams.get("vehicle");

  console.log("Estimate API called");
  console.log("From:", from);
  console.log("To:", to);
  console.log("Vehicle:", vehicle);

  if (!from || !to || !vehicle) {
    console.log("Missing parameters");
    return NextResponse.json({});
  }

  const rate = await client.fetch(
    groq`*[_type == "routeRate" &&
      fromCity->name == $from &&
      toCity->name == $to &&
      vehicleType == $vehicle
    ][0]{
      price
    }`,
    { from, to, vehicle },
  );

  console.log("Sanity result:", rate);

  return NextResponse.json(rate || {});
}
