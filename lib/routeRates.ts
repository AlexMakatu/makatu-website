import "server-only";
import { unstable_cache } from "next/cache";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

// Route rates: Zoho Creator report All_Route_Rates is the source of truth.
// Sanity routeRate documents are only used as a fallback if Creator fails.
// Cached for 1 hour under the tag "route-rates" (POST /api/admin/revalidate-rates refreshes it).

export type PriceType = "fixed" | "startingFrom" | "negotiable" | "quoteRequired";

export type RouteRate = {
  from: string;
  to: string;
  vehicleType: string; // hatchback | sedan | suv | bakkie | van | luxury | other
  priceType: PriceType;
  price: number | null;
};

export type RouteRatesResult = {
  source: "creator" | "sanity";
  rates: RouteRate[];
  error?: string;
  fetchedAt: string;
};

export const ROUTE_RATES_TAG = "route-rates";

const CREATOR_OWNER = process.env.ZOHO_RATES_OWNER || "makatu";
const CREATOR_APP = process.env.ZOHO_RATES_APP || "pod-application";
const CREATOR_REPORT = process.env.ZOHO_RATES_REPORT || "All_Route_Rates";
const PAGE_SIZE = 200;

/* ---------------- normalisers ---------------- */

/** Creator returns plain strings for text fields and {display_value} objects for lookups. */
function text(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    return String(o.display_value ?? o.zc_display_value ?? o.value ?? "").trim();
  }
  return String(v).trim();
}

export function normVehicleType(v: unknown): string {
  const t = text(v).toLowerCase();
  if (!t) return "other";
  if (t.startsWith("luxury") || t.includes("exotic")) return "luxury";
  if (["hatchback", "sedan", "suv", "bakkie", "van", "other"].includes(t)) return t;
  return t.replace(/\s+/g, "");
}

export function normPriceType(v: unknown): PriceType {
  const t = text(v).toLowerCase().replace(/[\s_-]/g, "");
  if (t === "fixed" || t === "fixedprice") return "fixed";
  if (t === "startingfrom") return "startingFrom";
  if (t === "negotiable") return "negotiable";
  return "quoteRequired";
}

function normPrice(v: unknown, priceType: PriceType): number | null {
  if (priceType === "quoteRequired") return null;
  const n = Number(text(v).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function isActive(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  const t = text(v).toLowerCase();
  return t === "true" || t === "1" || t === "yes";
}

/* ---------------- Creator ---------------- */

// Rates use their own OAuth client/token (ZOHO_RATES_*, needs ZohoCreator.report.READ) so quote
// submissions (lib/zohoCreator, ZOHO_*) stay isolated. Falls back to the ZOHO_* vars if not set.
// The access token is cached here (~55 min), separately from the quote flow, so rate reads never
// hammer Zoho's token endpoint (which throttles bursts of refreshes).
function ratesOAuth() {
  return {
    refreshToken: process.env.ZOHO_RATES_REFRESH_TOKEN || process.env.ZOHO_REFRESH_TOKEN || "",
    clientId: process.env.ZOHO_RATES_CLIENT_ID || process.env.ZOHO_CLIENT_ID || "",
    clientSecret: process.env.ZOHO_RATES_CLIENT_SECRET || process.env.ZOHO_CLIENT_SECRET || "",
    usingRatesClient: Boolean(process.env.ZOHO_RATES_REFRESH_TOKEN),
  };
}

let tokenCache: { token: string; expires: number } | null = null;
let tokenInflight: Promise<string> | null = null;

async function refreshRatesToken(): Promise<string> {
  const o = ratesOAuth();
  const res = await fetch("https://accounts.zoho.com/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: o.refreshToken,
      client_id: o.clientId,
      client_secret: o.clientSecret,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const data = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error?: string };
  if (!data.access_token) {
    throw new Error(`Zoho token refresh failed (${o.usingRatesClient ? "ZOHO_RATES_*" : "ZOHO_*"}): ${data.error ?? res.status}`);
  }
  const ttl = Math.min((data.expires_in ?? 3600) * 1000, 55 * 60 * 1000);
  tokenCache = { token: data.access_token, expires: Date.now() + ttl };
  return data.access_token;
}

async function creatorToken(): Promise<string> {
  if (tokenCache && tokenCache.expires > Date.now()) return tokenCache.token;
  if (!tokenInflight) {
    tokenInflight = refreshRatesToken().finally(() => {
      tokenInflight = null;
    });
  }
  return tokenInflight;
}

async function fetchFromCreator(): Promise<RouteRate[]> {
  const o = ratesOAuth();
  if (!o.refreshToken || !o.clientId || !o.clientSecret) {
    throw new Error("Zoho OAuth env vars not set (ZOHO_RATES_* or ZOHO_*)");
  }
  const token = await creatorToken();
  const base = `https://creator.zoho.com/api/v2/${CREATOR_OWNER}/${CREATOR_APP}/report/${CREATOR_REPORT}`;
  const rows: Record<string, unknown>[] = [];

  for (let from = 1; from < 5000; from += PAGE_SIZE) {
    const res = await fetch(`${base}?from=${from}&limit=${PAGE_SIZE}`, {
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const body = (await res.json().catch(() => ({}))) as {
      code?: number;
      data?: Record<string, unknown>[];
      message?: string;
    };
    // 3100 = no (more) records
    if (body.code === 3100) break;
    if (res.status === 401) tokenCache = null;
    if (!res.ok || body.code !== 3000 || !Array.isArray(body.data)) {
      throw new Error(`Creator ${res.status} code=${body.code ?? "?"}: ${JSON.stringify(body).slice(0, 300)}`);
    }
    rows.push(...body.data);
    if (body.data.length < PAGE_SIZE) break;
  }

  const rates = rows
    .filter((r) => isActive(r.Active))
    .map((r) => {
      const priceType = normPriceType(r.Price_Type);
      return {
        from: text(r.From_City),
        to: text(r.To_City),
        vehicleType: normVehicleType(r.Vehicle_Type),
        priceType,
        price: normPrice(r.Price, priceType),
      };
    })
    .filter((r) => r.from && r.to);

  if (rates.length === 0) throw new Error("Creator returned no active route rates");
  return rates;
}

/* ---------------- Sanity fallback ---------------- */

const sanityRatesQuery = groq`
*[_type == "routeRate" && active == true]{
  "from": fromCity->name,
  "to": toCity->name,
  vehicleType,
  priceType,
  price
}`;

async function fetchFromSanity(): Promise<RouteRate[]> {
  const rows: { from?: string; to?: string; vehicleType?: string; priceType?: string; price?: number }[] =
    await client.fetch(sanityRatesQuery);
  return rows
    .filter((r) => r.from && r.to)
    .map((r) => {
      const priceType = normPriceType(r.priceType);
      return {
        from: String(r.from).trim(),
        to: String(r.to).trim(),
        vehicleType: normVehicleType(r.vehicleType),
        priceType,
        price: normPrice(r.price, priceType),
      };
    });
}

/* ---------------- public API ---------------- */

async function loadRouteRates(): Promise<RouteRatesResult> {
  const fetchedAt = new Date().toISOString();
  try {
    const rates = await fetchFromCreator();
    console.log(`[route-rates] source=creator count=${rates.length}`);
    return { source: "creator", rates, fetchedAt };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`[route-rates] Creator failed, falling back to Sanity: ${error}`);
    const rates = await fetchFromSanity();
    console.log(`[route-rates] source=sanity count=${rates.length}`);
    return { source: "sanity", rates, error, fetchedAt };
  }
}

/** All active route rates (cached 1h, tag "route-rates"). Never throws unless both sources fail. */
// Concurrent cache misses (e.g. many pages rendering at once) share a single load.
let loadInflight: Promise<RouteRatesResult> | null = null;
function loadOnce(): Promise<RouteRatesResult> {
  if (!loadInflight) {
    loadInflight = loadRouteRates().finally(() => {
      loadInflight = null;
    });
  }
  return loadInflight;
}

export const getRouteRatesResult = unstable_cache(loadOnce, ["route-rates-v1"], {
  revalidate: 3600,
  tags: [ROUTE_RATES_TAG],
});

export async function getAllRouteRates(): Promise<RouteRate[]> {
  return (await getRouteRatesResult()).rates;
}

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Rates for one route (all vehicle types), sorted by vehicle type like the old GROQ query. */
export async function getRatesForRoute(from: string, to: string): Promise<RouteRate[]> {
  const rates = await getAllRouteRates();
  return rates
    .filter((r) => same(r.from, from) && same(r.to, to))
    .sort((a, b) => a.vehicleType.localeCompare(b.vehicleType));
}

/** Same semantics as sanity/lib/getRouteRate: exact route + vehicle (case-insensitive), first match. */
export async function getRouteRate(
  from: string,
  to: string,
  vehicleType: string,
): Promise<{ priceType: PriceType; price: number | null } | null> {
  const v = normVehicleType(vehicleType);
  const match = (await getRatesForRoute(from, to)).find((r) => r.vehicleType === v);
  return match ? { priceType: match.priceType, price: match.price } : null;
}

/** Lowest priced rate for a route (for route cards). Quote required when no priced rate exists. */
export function lowestForRoute(
  rates: RouteRate[],
  from?: string,
  to?: string,
): { lowestPrice?: number; priceType: PriceType } {
  if (!from || !to) return { priceType: "quoteRequired" };
  const priced = rates
    .filter((r) => same(r.from, from) && same(r.to, to) && typeof r.price === "number")
    .sort((a, b) => (a.price as number) - (b.price as number));
  if (priced.length === 0) return { priceType: "quoteRequired" };
  return { lowestPrice: priced[0].price as number, priceType: priced[0].priceType };
}

/** Attach lowestPrice/priceType to Sanity route documents. */
type CityRef = { fromCity?: { name?: string } | null; toCity?: { name?: string } | null };

export async function withLowestPrices<T>(
  routes: T[],
): Promise<(T & { lowestPrice?: number; priceType: PriceType })[]> {
  const rates = await getAllRouteRates().catch(() => [] as RouteRate[]);
  return (routes || []).map((r) => {
    const c = r as CityRef;
    return { ...r, ...lowestForRoute(rates, c?.fromCity?.name, c?.toCity?.name) };
  });
}
