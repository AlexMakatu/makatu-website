import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  CHAT_MODEL,
  CHAT_VECTOR_STORE_ID,
  CHAT_INSTRUCTIONS,
  CHAT_KNOWLEDGE,
  FALLBACK_ANSWER,
  applyPriceNote,
} from "@/lib/chatAssistant";

// AI answer webhook for the Zoho SalesIQ Zobot (replaces the OpenAI Assistant;
// OpenAI removed the Assistants API on 26 Aug 2026).
// Auth: header `x-chat-quote-secret` = process.env.CHAT_QUOTE_SECRET (same as /api/chat-quote).
// Request:  POST JSON { "question": "..." } (also message/text keys, form-encoded or plain-text body)
// Response: { ok: boolean, answer: string, hasPrice: boolean }  -> show `answer` to the visitor.

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const TIMEOUT_MS = 20000;

function secretOk(provided: string | null): boolean {
  const expected = process.env.CHAT_QUOTE_SECRET;
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

type ResponsesOutput = {
  output?: { type: string; content?: { type: string; text?: string }[] }[];
};

async function ask(question: string, useFileSearch: boolean, signal: AbortSignal): Promise<string> {
  const body: Record<string, unknown> = {
    model: CHAT_MODEL,
    instructions: useFileSearch
      ? CHAT_INSTRUCTIONS
      : `${CHAT_INSTRUCTIONS}\n\nKNOWLEDGE\n${CHAT_KNOWLEDGE}`,
    input: question,
    temperature: 0.3,
    max_output_tokens: 300,
    store: false,
  };
  if (useFileSearch) {
    body.tools = [{ type: "file_search", vector_store_ids: [CHAT_VECTOR_STORE_ID], max_num_results: 4 }];
  }
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = (await res.json()) as ResponsesOutput;
  return (data.output ?? [])
    .filter((o) => o.type === "message")
    .flatMap((o) => o.content ?? [])
    .filter((c) => c.type === "output_text")
    .map((c) => c.text ?? "")
    .join("")
    .trim();
}

const EMPTY_ANSWER = "What would you like to know about moving your vehicle?";
const QUESTION_KEYS = ["question", "message", "text", "query", "input"];

/** Pull the visitor's question from JSON, form-encoded or plain-text bodies. */
async function readQuestion(req: Request): Promise<string> {
  let raw = "";
  try {
    raw = await req.text();
  } catch {
    return "";
  }
  raw = raw.trim();
  if (!raw) return "";

  let value: unknown = raw;
  const type = req.headers.get("content-type") ?? "";
  if (raw.startsWith("{") || raw.startsWith("[") || raw.startsWith('"') || type.includes("json")) {
    try {
      value = JSON.parse(raw);
    } catch {
      value = raw; // not valid JSON: treat as plain text
    }
  } else if (type.includes("x-www-form-urlencoded") || /^[\w.-]+=/.test(raw)) {
    const form = new URLSearchParams(raw);
    value = Object.fromEntries(form.entries());
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    const key = QUESTION_KEYS.find((k) => typeof obj[k] === "string" || typeof obj[k] === "number");
    value = key ? String(obj[key]) : "";
  }
  if (typeof value !== "string") return "";
  return clean(value);
}

/** Drop unresolved SalesIQ/template placeholders such as %question% or ${question}. */
function clean(q: string): string {
  const t = q.trim().slice(0, 1000);
  if (/^(%[^%\s]+%|\$\{[^}]*\}|\{\{[^}]*\}\}|null|undefined)$/i.test(t)) return "";
  return t;
}

const emptyQuestion = () =>
  NextResponse.json({ ok: false, answer: EMPTY_ANSWER, hasPrice: false, reason: "empty_question" });

const fallback = (status = 200) =>
  NextResponse.json({ ok: false, answer: FALLBACK_ANSWER, hasPrice: false }, { status });

export async function POST(req: Request) {
  if (!secretOk(req.headers.get("x-chat-quote-secret"))) {
    return NextResponse.json({ ok: false, answer: "Unauthorized", hasPrice: false }, { status: 401 });
  }

  const question = await readQuestion(req);
  if (!question) return emptyQuestion();
  if (!process.env.OPENAI_API_KEY) return fallback();

  const signal = AbortSignal.timeout(TIMEOUT_MS);
  try {
    let text = "";
    try {
      text = await ask(question, true, signal);
    } catch (err) {
      // e.g. vector store not visible to this API key: retry once with the knowledge inline.
      if (signal.aborted) throw err;
      console.error("chat-answer file_search failed, retrying inline", err);
      text = await ask(question, false, signal);
    }
    if (!text) return fallback();
    const { answer, hasPrice } = applyPriceNote(text);
    return NextResponse.json({ ok: true, answer, hasPrice });
  } catch (err) {
    console.error("chat-answer failed", err);
    return fallback();
  }
}
