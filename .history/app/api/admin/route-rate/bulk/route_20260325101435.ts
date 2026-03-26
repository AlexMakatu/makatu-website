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
  const [header, ...rows] = text.split("\n");

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
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const text = await file.text();
  const rows = parseCSV(text);

  // 🔍 Fetch all cities once
  const cities: { _id: string; name: string }[] = await client.fetch(
    `*[_type == "city"]{_id, name}`,
  );

  const cityMap = new Map(cities.map((c) => [c.name.toLowerCase(), c._id]));

  const results = [];

  for (const row of rows) {
    const fromCityId = cityMap.get(row.fromCity.toLowerCase());
    const toCityId = cityMap.get(row.toCity.toLowerCase());

    if (!fromCityId || !toCityId) {
      results.push({ row, error: "City not found" });
      continue;
    }

    const price = row.price ? Number(row.price) : undefined;

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

    try {
      if (existing) {
        await client.patch(existing).set(doc).commit();
      } else {
        await client.create(doc);
      }

      results.push({ row, success: true });
    } catch (err) {
      results.push({ row, error: "Failed to save" });
    }
  }

  return NextResponse.json({ results });
}
