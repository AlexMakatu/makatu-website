import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { adminSecretOk } from "@/lib/adminSecret";
import { ROUTE_RATES_TAG } from "@/lib/routeRates";

// POST (header x-chat-quote-secret) -> drop cached route rates so the next request re-reads Zoho Creator.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!adminSecretOk(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  revalidateTag(ROUTE_RATES_TAG);
  return NextResponse.json({ ok: true, revalidated: ROUTE_RATES_TAG, at: new Date().toISOString() });
}
