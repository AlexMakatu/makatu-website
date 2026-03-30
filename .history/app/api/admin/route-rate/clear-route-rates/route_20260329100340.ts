import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const { key } = await req.json();

    if (key !== process.env.ADMIN_UPLOAD_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔥 Get ALL routeRates
    const rates: { _id: string }[] = await writeClient.fetch(
      `*[_type == "routeRate"]{ _id }`,
    );

    const tx = writeClient.transaction();

    for (const rate of rates) {
      tx.delete(rate._id);
    }

    await tx.commit();

    return NextResponse.json({
      deleted: rates.length,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
