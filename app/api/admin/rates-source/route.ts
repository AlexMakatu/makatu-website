import { NextResponse } from "next/server";
import { adminSecretOk } from "@/lib/adminSecret";
import { getRouteRatesResult } from "@/lib/routeRates";

// GET (header x-chat-quote-secret) -> which source the cached route rates came from.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!adminSecretOk(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const r = await getRouteRatesResult();
  return NextResponse.json({
    source: r.source,
    count: r.rates.length,
    fetchedAt: r.fetchedAt,
    sample: r.rates.slice(0, 5),
    ...(r.error ? { error: r.error } : {}),
  });
}
