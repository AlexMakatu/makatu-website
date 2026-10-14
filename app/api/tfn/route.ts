import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeEqual(a: string, b: string): boolean {
  // hash both so lengths match; timingSafeEqual is constant-time
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb) && a.length === b.length;
}

export async function POST(req: NextRequest) {
  const token = process.env.TFN_WEBHOOK_TOKEN;
  const zohoUrl = process.env.ZOHO_TFN_URL;
  if (!token || !zohoUrl) {
    console.error("[tfn] missing env config");
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 500 });
  }

  const auth = req.headers.get("authorization") ?? "";
  if (!safeEqual(auth, `Bearer ${token}`)) {
    console.warn("[tfn] unauthorized request");
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }
  if (payload === null || typeof payload !== "object") {
    return NextResponse.json({ ok: false, error: "body must be a JSON array or object" }, { status: 400 });
  }
  const items = Array.isArray(payload) ? payload : [payload];

  // Zoho Custom API ("Entire JSON") rejects a bare array (code 3020); wrap it in an object.
  try {
    const res = await fetch(zohoUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: items }),
      cache: "no-store",
    });
    const text = await res.text();
    let zoho: { code?: number; message?: string } = {};
    try { zoho = JSON.parse(text); } catch { /* non-JSON */ }
    const okCode = zoho.code === undefined || zoho.code === 3000;
    if (res.ok && okCode) {
      console.info(`[tfn] forwarded ${items.length} transaction(s)`);
      return NextResponse.json({ ok: true, count: items.length });
    }
    console.error(`[tfn] zoho error status=${res.status} code=${zoho.code}`);
    return NextResponse.json(
      { ok: false, error: "zoho rejected", zohoStatus: res.status, zohoCode: zoho.code, zohoMessage: zoho.message ?? text.slice(0, 300) },
      { status: 502 }
    );
  } catch (e) {
    console.error("[tfn] zoho unreachable", (e as Error).message);
    return NextResponse.json({ ok: false, error: "zoho unreachable" }, { status: 502 });
  }
}

export function GET() {
  return NextResponse.json({ ok: false, error: "method not allowed" }, { status: 405, headers: { Allow: "POST" } });
}
