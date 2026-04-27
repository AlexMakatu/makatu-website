export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return new Response(JSON.stringify({ error: "Missing URL" }), {
        status: 400,
      });
    }

    const key = "d4747931b7b450982c62f9787ab23fb";

    const endpoint = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(
      url,
    )}&key=${key}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "IndexNow request failed" }),
        { status: 500 },
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
    });
  }
}
