import { NextResponse } from "next/server";
import { getRouteRate, getAllRouteRates, lowestForRoute } from "@/lib/routeRates";

// Rates come from Zoho Creator (Sanity fallback) via lib/routeRates.
// GET  ?from=&to=&vehicle=          -> { priceType, price } for that vehicle (quote form)
// POST { fromCity, toCity, vehicleType? } -> same; without vehicleType returns the route's lowest rate (home Quick Estimate)

function out(rate: { priceType: string; price: number | null } | null) {
  if (!rate) return NextResponse.json({});
  return NextResponse.json(
    rate.price == null ? { priceType: rate.priceType } : { priceType: rate.priceType, price: rate.price },
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const vehicle = searchParams.get("vehicle");
  if (!from || !to || !vehicle) return NextResponse.json({});
  return out(await getRouteRate(from, to, vehicle));
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const from = typeof body.fromCity === "string" ? body.fromCity : "";
  const to = typeof body.toCity === "string" ? body.toCity : "";
  const vehicle = typeof body.vehicleType === "string" ? body.vehicleType : "";
  if (!from || !to) return NextResponse.json({});
  if (vehicle) return out(await getRouteRate(from, to, vehicle));
  const low = lowestForRoute(await getAllRouteRates(), from, to);
  return out(low.lowestPrice ? { priceType: low.priceType, price: low.lowestPrice } : null);
}
