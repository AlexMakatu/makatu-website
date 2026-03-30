import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
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
      transitTime: c[6]?.trim(), // ✅ NEW
    };
  });
}

/* ================= API ================= */

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

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

    /* ================= FETCH CITIES ================= */

    const cities: { _id: string; name: string }[] = await writeClient.fetch(
      `*[_type == "city"]{_id,name}`,
    );

    const cityMap = new Map(
      cities.map((c) => [c.name.toLowerCase().trim(), c]),
    );

    const tx = writeClient.transaction();

    const results: {
      row: CsvRow;
      success?: boolean;
      error?: string;
    }[] = [];

    /* ================= PROCESS ROWS ================= */

    for (const row of parsed) {
      try {
        if (!row.fromCity || !row.toCity || !row.vehicleType) {
          results.push({ row, error: "Missing required fields" });
          continue;
        }

        const from = cityMap.get(row.fromCity.toLowerCase().trim());
        const to = cityMap.get(row.toCity.toLowerCase().trim());

        if (!from || !to) {
          results.push({ row, error: "City not found" });
          continue;
        }

        /* ================= NORMALIZE ================= */

        const vehicleType = row.vehicleType.toLowerCase().trim();

        /* ================= PRICE ================= */

        const rawPrice = row.price?.trim();

        let price = rawPrice ? Number(rawPrice) : undefined;
        let priceType = row.priceType;

        if (price !== undefined && isNaN(price)) {
          price = undefined;
        }

        if (price === undefined || price === 0) {
          priceType = "quoteRequired";
          price = undefined;
        }

        /* ================= TRANSIT TIME ================= */

        const transitTime = row.transitTime
          ? Number(row.transitTime)
          : undefined;

        /* ================= ROUTE ================= */

        const routeId = `route-${from._id}-${to._id}`;

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
          transitTime: transitTime ?? 2,
          featuredRoute: false,
        });

        // ✅ ALWAYS update transit time if provided
        if (transitTime !== undefined && !isNaN(transitTime)) {
          tx.patch(routeId, {
            set: { transitTime },
          });
        }

        /* ================= ROUTE RATE ================= */

        const rateId = `routeRate-${from._id}-${to._id}-${vehicleType}`;

        tx.createOrReplace({
          _id: rateId,
          _type: "routeRate",
          title: `${from.name} to ${to.name} - ${vehicleType}`,
          fromCity: { _type: "reference", _ref: from._id },
          toCity: { _type: "reference", _ref: to._id },
          vehicleType,
          priceType,
          price,
          active: row.active !== "false",
        });

        results.push({ row, success: true });
      } catch (err) {
        console.error("Row failed:", row, err);
        results.push({ row, error: "Failed to process row" });
      }
    }

    /* ================= COMMIT ================= */

    await tx.commit();

    return NextResponse.json({ results });
  } catch (error) {
    console.error("FULL ERROR:", error);

    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
