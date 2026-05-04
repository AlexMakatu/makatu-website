const INDEXNOW_KEY = "d4747931b7b450982c62f9787ab23fb";
const SITE_URL = "https://makatu.co.za";

function buildUrl(type: string, slug: string): string | null {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");

  switch (type) {
    case "post":
      return `${SITE_URL}/blog/${cleanSlug}`;

    case "vehicleTransport":
      return `${SITE_URL}/vehicle-transport/${cleanSlug}`;

    case "city":
      return `${SITE_URL}/vehicle-transport/city/${cleanSlug}`;

    case "legal":
      return `${SITE_URL}/legal/${cleanSlug}`;

    default:
      return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const type = body._type;
    const slug = body.slug;

    if (typeof type !== "string" || typeof slug !== "string") {
      return new Response(
        JSON.stringify({ skipped: true, reason: "Missing _type or slug" }),
        { status: 200 },
      );
    }

    const url = buildUrl(type, slug);

    if (!url) {
      return new Response(
        JSON.stringify({
          skipped: true,
          reason: "Unsupported content type",
          type,
        }),
        { status: 200 },
      );
    }

    const endpoint = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(
      url,
    )}&key=${INDEXNOW_KEY}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "IndexNow request failed",
          status: response.status,
          url,
        }),
        { status: 500 },
      );
    }

    return new Response(JSON.stringify({ success: true, url }), {
      status: 200,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
    });
  }
}
