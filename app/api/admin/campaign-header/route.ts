import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

export const runtime = "nodejs";

const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const key = String(form.get("key") || "");
  if (!process.env.ADMIN_UPLOAD_KEY || key !== process.env.ADMIN_UPLOAD_KEY) {
    return NextResponse.json({ error: "Wrong admin key" }, { status: 401 });
  }
  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json({ error: "SANITY_API_TOKEN is not set on the server" }, { status: 500 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No image file" }, { status: 400 });
  if (!TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Use JPG, PNG, WEBP or GIF" }, { status: 400 });
  }
  if (file.size > MAX) return NextResponse.json({ error: "Image is over 8 MB" }, { status: 400 });

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const asset = await writeClient.assets.upload("image", buf, {
      filename: file.name || "campaign-header",
      contentType: file.type,
    });
    const res = NextResponse.json({ url: asset.url, id: asset._id });
    res.cookies.set("adminKey", key, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Sanity upload failed: " + (e as Error).message }, { status: 502 });
  }
}
