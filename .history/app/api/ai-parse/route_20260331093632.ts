import OpenAI from "openai";

type AIParseResult = {
  fromCity: string | null;
  toCity: string | null;
  vehicleType: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
};
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const body: unknown = await req.json();

  // ✅ Validate input safely
  if (
    typeof body !== "object" ||
    body === null ||
    !("message" in body) ||
    typeof (body as { message: unknown }).message !== "string"
  ) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const { message } = body as { message: string };

  try {
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
  "vehicleType": string | null,
  "vehicleMake": string | null,
  "vehicleModel": string | null
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

IMPORTANT:
- If a specific car model is mentioned, classify it into the closest vehicle type.
- Do NOT return "other" unless absolutely no reasonable classification can be made.
- Always choose the closest valid category.

Examples:
- Daihatsu Sirion → hatchback
- Toyota Corolla → sedan
- Ford Ranger → bakkie
- BMW X3 → suv
- Mercedes S-Class → luxury

If unsure, still choose the closest category instead of "other".

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
      // ✅ Clean possible markdown formatting (just in case)
      const clean = text.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean) as AIParseResult;
    } catch {
      return Response.json(
        { error: "Invalid AI response format", raw: text },
        { status: 500 },
      );
    }

    // ✅ HARD SAFETY: enforce allowed vehicle types
    const allowed = [
      "hatchback",
      "sedan",
      "suv",
      "bakkie",
      "van",
      "luxury",
      "other",
    ];

    if (!parsed.vehicleType || !allowed.includes(parsed.vehicleType)) {
      parsed.vehicleType = "other";
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("AI Parse Error:", error);

    return Response.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
