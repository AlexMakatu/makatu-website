import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import type { CsvRow } from "@/types/routeRate";

/* ================= HELPERS ================= */

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .slice(0, 96);
}

function parseCSV(text: string): CsvRow[] {
  const lines = text.split("\n").filter(Boolean);
  const [, ...rows] = lines;

  return rows.map((row) => {
    const c = row.split(",");
    return {
      fromCity: c[0]?.trim(),
      toCity: c[1]?.trim(),
      vehicleType: c[2]?.trim(),
      priceType: c[3]?.trim() as CsvRow["priceType"],
      price: c[4]?.trim(),
      active: c[5]?.trim(),
    };
  });
}

/* ================= API ================= */

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // 🔐 Passkey protection
    const key = formData.get("key");
    if (key !== process.env.ADMIN_UPLOAD_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    const parsed = parseCSV(text);

    console.log("Parsed rows:", parsed.length);

    // 🔍 Fetch cities
    const cities: { _id: string; name: string }[] = await client.fetch(
      `*[_type == "city"]{_id,name}`,
    );

    const cityMap = new Map(cities.map((c) => [c.name.toLowerCase(), c]));

    const tx = client.transaction();
    const results: {
      row: CsvRow;
      success?: boolean;
      error?: string;
    }[] = [];

    for (const row of parsed) {
      try {
        if (!row.fromCity || !row.toCity || !row.vehicleType) {
          results.push({ row, error: "Missing required fields" });
          continue;
        }

        const from = cityMap.get(row.fromCity.toLowerCase());
        const to = cityMap.get(row.toCity.toLowerCase());

        if (!from || !to) {
          results.push({ row, error: "City not found" });
          continue;
        }

        const price = row.price ? Number(row.price) : undefined;

        /* ================= ROUTE CREATION ================= */

        const routeId = `route.${from._id}_${to._id}`;

        tx.createIfNotExists({
          _id: routeId,
          _type: "route",
          title: `${from.name} to ${to.name} Vehicle Transport`,
          slug: {
            _type: "slug",
            current: slugify(`${from.name}-to-${to.name}`),
          },
          fromCity: { _type: "reference", _ref: from._id },
          toCity: { _type: "reference", _ref: to._id },
          transitTime: 2, // default
          featuredRoute: false,
        });

        /* ================= RATE CREATION ================= */

        const rateId = `routeRate.${from._id}_${to._id}_${row.vehicleType}`;

        tx.createOrReplace({
          _id: rateId,
          _type: "routeRate",
          title: `${from.name} to ${to.name} - ${row.vehicleType}`,
          fromCity: { _type: "reference", _ref: from._id },
          toCity: { _type: "reference", _ref: to._id },
          vehicleType: row.vehicleType,
          priceType: row.priceType,
          price,
          active: row.active !== "false",
        });

        results.push({ row, success: true });
      } catch (err) {
        console.error("Row failed:", row, err);
        results.push({ row, error: "Failed to process row" });
      }
    }

    await tx.commit();

    console.log("Upload complete");

    return NextResponse.json({ results });
  } catch (error) {
    console.error("FULL ERROR:", error);

    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
