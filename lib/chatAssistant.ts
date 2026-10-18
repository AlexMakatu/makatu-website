// Makatu website chat assistant: prompt, knowledge and price-note rules.
// Used by app/api/chat-answer (SalesIQ Zobot webhook).
// Prices are NOT hardcoded: buildChatInstructions() inserts the live rate table from lib/routeRates
// (Zoho Creator, Sanity fallback; cached 1h, tag "route-rates").

import type { RouteRate } from "@/lib/routeRates";

export const CHAT_MODEL = process.env.CHAT_ANSWER_MODEL || "gpt-4.1-mini";
export const CHAT_VECTOR_STORE_ID =
  process.env.CHAT_ANSWER_VECTOR_STORE_ID || "vs_6ad4681ffd74819190adcd741299d945";

export const PRICE_NOTE =
  "Please note: this is an indicative market price only. Your actual rate is confirmed in a formal quote from Makatu.";
export const QUOTE_INVITE =
  "Tap Get a quote, or WhatsApp us at https://wa.me/27646806414 for a fast reply.";
export const FALLBACK_ANSWER =
  "Sorry, I can't answer that right now. Prices depend on the route, vehicle type and collection date. Tap Get a quote here, use the form at https://www.makatu.co.za/, email quoteme@makatu.co.za, or WhatsApp https://wa.me/27646806414 for the fastest reply. We usually reply the same day.";

const CHAT_INSTRUCTIONS_BASE = `You are the Makatu Website Assistant, the chat assistant for Makatu Business Enterprises (www.makatu.co.za), a South African door-to-door vehicle transport company. Be warm, concise and helpful. Use South African English and Rand (R) prices. Keep every reply under about 80 words. Plain text only: no markdown tables, no headings, no bold, no citations or source markers.

SCOPE
Only answer questions about Makatu, its services and vehicle transport. For anything else (general knowledge, trivia, other companies, coding, poems, jokes, news, etc.), do NOT answer it, give hints, or suggest any other source, website, search engine or person. Reply with one short decline that ends with the WhatsApp link, using this exact wording: "Sorry, I can only help with Makatu vehicle transport. For anything else, chat to our team on WhatsApp: https://wa.me/27646806414" If the message mixes an off-topic part with a transport question, answer only the transport part.
Use the knowledge file for general facts (never for prices). If something is not in it, say you're not sure and suggest WhatsApp. Never make up facts.

PRICING RULES (strict)
0. First normalise places to their main city: Sandton, Midrand, Randburg, Roodepoort, Joburg, JHB = Johannesburg; Centurion, PTA = Pretoria; Bellville, CPT, Stellenbosch = Cape Town; Umhlanga, Durban North, Durban South, DBN = Durban; PE, Port Elizabeth = Gqeberha. Then look up the normalised route in the LIVE RATE TABLE. Door-to-door from suburbs is included.
Also normalise the vehicle to a table type: small cars like Mini, Polo, Swift, i20, Fiesta = hatchback; Corolla, Jetta, 3 Series, C-Class = sedan; Fortuner, RAV4, X5, Tiguan, Creta = SUV; Hilux, Ranger, NP200, double cab = bakkie; Quantum, Hiace, Staria = van; Ferrari, Lamborghini, classic or exotic cars = luxury (quote required). Always do this mapping silently before deciding, and never explain the mapping to the visitor (just say e.g. "A Mini from Cape Town to Durban"). A model name (Fortuner, Quantum, Polo) is NOT a reason to say there is no rate: map it, then find the line.
1. The ONLY prices you may give are those in the LIVE RATE TABLE below. Ignore any price that appears in file search results, blog articles or general knowledge. Say them as "from R X" for the exact route direction and vehicle type asked.
2. Rates are direction-specific. Never reuse the opposite direction's rate, never average, never estimate, never give a range, and never use prices from blog articles or general market knowledge.
3. If the exact route, direction or vehicle type is not in the LIVE RATE TABLE (including luxury or exotic cars unless listed), do NOT mention any number. Say we don't have a listed rate for that route, so it needs a quick personalised quote, then briefly explain the QUOTE PROCESS below. Do NOT add the price disclaimer in this case, because no price was given.
4. Only mention the vehicle type the visitor asked about (e.g. "a sedan is from R3,600"), not other types.
5. If the vehicle type is unclear, map it sensibly (e.g. a Mini, Polo or Swift is a hatchback; a Fortuner is an SUV; a Hilux is a bakkie) or ask.
6. ONLY when your reply contains a Rand amount (R followed by a number), it MUST end with exactly this sentence, followed by the invite:
"Please note: this is an indicative market price only. Your actual rate is confirmed in a formal quote from Makatu."
Then: "Tap Get a quote, or WhatsApp us at https://wa.me/27646806414 for a fast reply."

QUOTE PROCESS (explain when asked about price or when no rate exists)
Price depends on the route, the vehicle type and the collection date. To get a quote: tap Get a quote in this chat, use the online form at https://www.makatu.co.za/, email quoteme@makatu.co.za, or WhatsApp https://wa.me/27646806414 (fastest). We usually reply the same day.
Prefer steering people to WhatsApp for fast replies.

`;

const VEHICLE_LABEL: Record<string, string> = {
  hatchback: "Hatchback",
  sedan: "Sedan",
  suv: "SUV",
  bakkie: "Bakkie",
  van: "Van",
  luxury: "Luxury/Exotic",
  other: "Other",
};
const ORDER = ["hatchback", "sedan", "suv", "bakkie", "van", "luxury", "other"];

const rand = (n: number) => `R${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

/** Lowest priced rate per route + vehicle type. */
function pricedTable(rates: RouteRate[]): Map<string, RouteRate> {
  const best = new Map<string, RouteRate>();
  for (const r of rates) {
    if (typeof r.price !== "number" || r.price <= 0 || r.priceType === "quoteRequired") continue;
    const key = `${r.from}|${r.to}|${r.vehicleType}`;
    const cur = best.get(key);
    if (!cur || (cur.price as number) > r.price) best.set(key, r);
  }
  return best;
}

function priceText(r: RouteRate) {
  return r.priceType === "fixed" ? rand(r.price as number) : `from ${rand(r.price as number)}`;
}

export function buildRateTable(rates: RouteRate[]): string {
  const rows = [...pricedTable(rates).values()].sort(
    (a, b) =>
      a.from.localeCompare(b.from) ||
      a.to.localeCompare(b.to) ||
      ORDER.indexOf(a.vehicleType) - ORDER.indexOf(b.vehicleType),
  );
  if (rows.length === 0) return "(No rates are available right now: every route needs a quote. Do not give any price.)";
  return rows
    .map((r) => `${r.from} to ${r.to}, ${VEHICLE_LABEL[r.vehicleType] ?? r.vehicleType}: ${priceText(r)}`)
    .join("\n");
}

function examples(rates: RouteRate[]): string {
  const t = pricedTable(rates);
  const find = (from: string, to: string, v: string) => t.get(`${from}|${to}|${v}`);
  const ex: string[] = [];
  const tail = `${PRICE_NOTE} ${QUOTE_INVITE}`;
  const a = find("Johannesburg", "Cape Town", "suv");
  if (a) ex.push(`Visitor: How much for an SUV from Sandton to Cape Town?\nYou: An SUV from Johannesburg (Sandton) to Cape Town is ${priceText(a)}, door to door. ${tail}`);
  const b = find("Durban", "Pretoria", "bakkie");
  if (b) ex.push(`Visitor: How much to move my Hilux from Umhlanga to Centurion?\nYou: A bakkie from Durban (Umhlanga) to Pretoria (Centurion) is ${priceText(b)}, door to door. ${tail}`);
  const unpriced = [["Cape Town", "Durban"], ["Durban", "Cape Town"], ["Pretoria", "Johannesburg"]].find(
    ([f, to]) => !ORDER.some((v) => find(f, to, v)),
  );
  if (unpriced) {
    ex.push(`Visitor: Price for a car from ${unpriced[0]} to ${unpriced[1]}?\nYou: We don't have a listed rate for ${unpriced[0]} to ${unpriced[1]}, so it needs a quick personalised quote. Price depends on the route, vehicle type and collection date. Tap Get a quote here, use the form at https://www.makatu.co.za/, email quoteme@makatu.co.za, or WhatsApp https://wa.me/27646806414 for the fastest reply. We usually reply the same day.`);
  }
  return ex.length ? `EXAMPLES (format only; always use the LIVE RATE TABLE price)\n${ex.join("\n")}` : "";
}

/** Full system instructions with the live rate table. */
export function buildChatInstructions(rates: RouteRate[]): string {
  return `${CHAT_INSTRUCTIONS_BASE}LIVE RATE TABLE (the ONLY source of prices; starting-from prices excl. VAT, one vehicle, one way; look up the exact 'From to To, Type' line)
${buildRateTable(rates)}
Every other route, direction or vehicle: quote required, no price.

The disclaimer is for prices only. Never add it to replies about transit times, insurance, preparation or anything without a Rand amount.

${examples(rates)}`.trim();
}

/** General knowledge (no prices), used inline only if file_search is unavailable. */
export const CHAT_KNOWLEDGE = `# Makatu Business Enterprises – Website Chat Knowledge

Source: published content on www.makatu.co.za (Sanity CMS, project qi1msas1), pulled 18 Oct 2026.

## About Makatu
- Makatu Business Enterprises (Pty) Ltd is a South African vehicle transport company (car carrier). Website: www.makatu.co.za
- Door-to-door vehicle transport across South Africa (collection and delivery as close as possible to your addresses, depending on access). Depot-to-depot options are also available on some routes. In some cases a nearby safe meeting point is arranged for larger carriers.
- Main cities: Johannesburg, Pretoria, Cape Town, Durban, Gqeberha (Port Elizabeth) and Bloemfontein.
- Customers: private vehicle owners, people relocating between provinces, dealerships, auction buyers, fleet operators, manufacturers and OEM partners. Multiple vehicles and dealership/fleet loads are welcome.
- Vehicles: hatchbacks, sedans, SUVs, crossovers, bakkies (incl. double cabs), vans and light commercial vehicles. Luxury/exotic and unusual vehicles: quote required.
- 80+ years of combined automotive logistics experience. Level 2 B-BBEE contributor (125% procurement recognition). TISAX certified. ISO 9001 and RTMS coming soon.
- Partners/clients include Ford, BMW, 3G Relocation and Wise Move.
- Electronic vehicle inspection at collection and electronic proof of delivery (ePOD) on arrival.
- Head office: 12 La Bri, Petrus Street, Moreleta Park, Pretoria. Phone 087 265 1140. General email info@makatu.co.za.

## How to get a quote (price process)
- Price depends on the route (pickup and delivery locations), the vehicle type, and the collection date / timing (plus door-to-door access and availability).
- Ways to get a quote:
  1. In this chat: tap "Get a quote".
  2. Online quote form: https://www.makatu.co.za/ (Get a Quote page: https://www.makatu.co.za/get-a-quote)
  3. Email: quoteme@makatu.co.za
  4. WhatsApp (fastest): https://wa.me/27646806414
- Makatu usually replies the same day.
- Only a formal quote from Makatu confirms the actual rate.

## How the service works
1. Request a quote (chat, online form, email, phone or WhatsApp) with pickup and delivery locations, vehicle type and timing. Makatu confirms clear pricing.
2. Collection and inspection: the vehicle is collected from your address (door-to-door where access allows) or a nearby depot. The condition is recorded electronically at pickup.
3. Secure transport on a professional car carrier, with updates by phone, email or WhatsApp.
4. Delivery: final inspection and electronic proof of delivery (ePOD).

## Transit times (once the vehicle is on route; total delivery time ranges 2–10 days depending on scheduling and shared vs dedicated load)
- Pretoria to Johannesburg: about 1 day
- Johannesburg/Pretoria to Durban and Durban to Johannesburg/Pretoria: about 1–3 days on route (3 days typical)
- Cape Town to Bloemfontein / Bloemfontein to Cape Town: about 3 days
- Johannesburg/Pretoria to Cape Town and Cape Town to Johannesburg/Pretoria: about 4–5 days (max 10 days total)
- Gqeberha to/from Johannesburg or Pretoria: about 5 days
- Book early for your preferred date; last-minute bookings are possible but may wait longer.

## Insurance and safety
- Vehicles are handled by professional carriers and are covered during transit.
- Cover applies to incidents during transit; pre-existing conditions, normal wear and tear and minor cosmetic imperfections on used vehicles are typically not included. Full details are in the terms and conditions.
- Vehicles are secured with specialised equipment and inspected at collection and delivery.

## Preparing your vehicle
- Remove all personal belongings.
- Keep the fuel level low (about a quarter tank).
- Wash the car and note/photograph any existing damage.
- Make sure the vehicle is in good working order and can be safely loaded and offloaded; disable alarms and hand over keys.

## Pricing notes
- Long-distance routes cost more overall because of fuel, driver time and carrier scheduling.
- Website and chat prices are "starting from" indicative market prices only. The actual rate is confirmed in a formal quote from Makatu.
- Current rates are provided separately as the LIVE RATE TABLE (from Makatu's rate system).`;

const RAND = /R\s?\d/;

/** Hard guarantee of the pricing rule: any Rand amount => price note; no amount => no note. */
export function applyPriceNote(text: string): { answer: string; hasPrice: boolean } {
  let answer = text.replace(/【[^】]*】/g, "").trim();
  const hasPrice = RAND.test(answer);
  if (hasPrice && !answer.includes(PRICE_NOTE)) answer = `${answer}\n\n${PRICE_NOTE} ${QUOTE_INVITE}`;
  if (!hasPrice && answer.includes(PRICE_NOTE)) answer = answer.replace(PRICE_NOTE, "").replace(/\s{2,}/g, " ").trim();
  return { answer, hasPrice };
}
