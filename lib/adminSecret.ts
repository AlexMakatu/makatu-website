import { timingSafeEqual } from "crypto";

/** Same shared secret as the SalesIQ webhooks (header x-chat-quote-secret). */
export function adminSecretOk(req: Request): boolean {
  const expected = process.env.CHAT_QUOTE_SECRET;
  const provided = req.headers.get("x-chat-quote-secret");
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
