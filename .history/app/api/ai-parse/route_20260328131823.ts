import OpenAI from "openai";

type AIParseResult = {
  fromCity?: string;
  toCity?: string;
  vehicleType?: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const body: unknown = await req.json();

  if (
    typeof body !== "object" ||
    body === null ||
    !("message" in body) ||
    typeof (body as { message: unknown }).message !== "string"
  ) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const { message } = body as { message: string };

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
Extract vehicle transport details from user input.

Return ONLY valid JSON:
{
  "fromCity": string | null,
  "toCity": string | null,
  "vehicleType": string | null
}

Rules:
- Normalize cities (e.g. Joburg → Johannesburg)

Vehicle types must be one of:
hatchback, sedan, suv, bakkie, van, luxury, other

Interpret synonyms:
- pickup, pick-up, truck → bakkie
- 4x4, crossover → suv
- small car → hatchback
- executive car → sedan

If unsure, choose the closest match.

If a value is missing, return null.
`,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content;

  if (!text) {
    return Response.json({ error: "No response from AI" }, { status: 500 });
  }

  let parsed: AIParseResult;

  try {
    parsed = JSON.parse(text) as AIParseResult;
  } catch {
    return Response.json({ error: "Invalid AI response" }, { status: 500 });
  }

  return Response.json(parsed);
}
