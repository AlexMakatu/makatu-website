import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

type CsvRow = {
  fromCity: string;
  toCity: string;
  vehicleType: string;
  priceType: "fixed" | "startingFrom" | "negotiable" | "quoteRequired";
  price?: string;
  active?: string;
};

function parseCSV(text: string): CsvRow[] {
  const lines = text.split("\n").filter(Boolean);
  const [, ...rows] = lines;

  return rows.map((row) => {
    const cols = row.split(",");

    return {
      fromCity: cols[0]?.trim(),
      toCity: cols[1]?.trim(),
      vehicleType: cols[2]?.trim(),
      priceType: cols[3]?.trim() as CsvRow["priceType"],
      price: cols[4]?.trim(),
      active: cols[5]?.trim(),
    };
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // 🔐 PASSKEY PROTECTION
    const key = formData.get("key");

    if (key !== process.env.ADMIN_UPLOAD_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    const rows = parseCSV(text);

    // 🔍 Fetch all cities
    const cities: { _id: string; name: string }[] = await client.fetch(
      `*[_type == "city"]{_id, name}`,
    );

    const cityMap = new Map(cities.map((c) => [c.name.toLowerCase(), c._id]));

    const results: {
      row: CsvRow;
      success?: boolean;
      error?: string;
    }[] = [];

    for (const row of rows) {
      try {
        if (
          !row.fromCity ||
          !row.toCity ||
          !row.vehicleType ||
          !row.priceType
        ) {
          results.push({ row, error: "Missing required fields" });
          continue;
        }

        const fromCityId = cityMap.get(row.fromCity.toLowerCase());
        const toCityId = cityMap.get(row.toCity.toLowerCase());

        if (!fromCityId || !toCityId) {
          results.push({ row, error: "City not found" });
          continue;
        }

        const price = row.price ? Number(row.price) : undefined;

        if (row.priceType === "fixed" && price === undefined) {
          results.push({ row, error: "Fixed price requires value" });
          continue;
        }

        // 🔍 Check existing
        const existing = await client.fetch(
          `*[_type == "routeRate"
            && fromCity._ref == $fromCityId
            && toCity._ref == $toCityId
            && vehicleType == $vehicleType
          ][0]._id`,
          {
            fromCityId,
            toCityId,
            vehicleType: row.vehicleType,
          },
        );

        const doc = {
          _type: "routeRate",
          title: `${row.fromCity} to ${row.toCity} - ${row.vehicleType}`,
          fromCity: { _type: "reference", _ref: fromCityId },
          toCity: { _type: "reference", _ref: toCityId },
          vehicleType: row.vehicleType,
          priceType: row.priceType,
          price,
          active: row.active !== "false",
        };

        if (existing) {
          await client.patch(existing).set(doc).commit();
        } else {
          await client.create(doc);
        }

        results.push({ row, success: true });
      } catch {
        results.push({ row, error: "Failed to save" });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
