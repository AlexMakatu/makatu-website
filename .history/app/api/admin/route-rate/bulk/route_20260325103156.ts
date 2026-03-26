import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import type { CsvRow } from "@/types/routeRate";
export async function POST(req: Request) {
  const formData = await req.formData();

  const key = formData.get("key");
  if (key !== process.env.ADMIN_UPLOAD_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const text = await file.text();
  const lines = text.split("\n").filter(Boolean);
  const [, ...rows] = lines;

  const parsed: CsvRow[] = rows.map((r) => {
    const c = r.split(",");
    return {
      fromCity: c[0]?.trim(),
      toCity: c[1]?.trim(),
      vehicleType: c[2]?.trim(),
      priceType: c[3]?.trim() as CsvRow["priceType"],
      price: c[4]?.trim(),
      active: c[5]?.trim(),
    };
  });

  const cities: { _id: string; name: string }[] = await client.fetch(
    `*[_type == "city"]{_id,name}`,
  );

  const cityMap = new Map(cities.map((c) => [c.name.toLowerCase(), c._id]));

  const tx = client.transaction();
  const results = [];

  for (const row of parsed) {
    const fromId = cityMap.get(row.fromCity.toLowerCase());
    const toId = cityMap.get(row.toCity.toLowerCase());

    if (!fromId || !toId) {
      results.push({ row, error: "City not found" });
      continue;
    }

    const price = row.price ? Number(row.price) : undefined;

    const doc = {
      _type: "routeRate",
      title: `${row.fromCity} to ${row.toCity} - ${row.vehicleType}`,
      fromCity: { _type: "reference", _ref: fromId },
      toCity: { _type: "reference", _ref: toId },
      vehicleType: row.vehicleType,
      priceType: row.priceType,
      price,
      active: row.active !== "false",
    };

    const id = `${fromId}_${toId}_${row.vehicleType}`;

    tx.createOrReplace({
      _id: `routeRate.${id}`,
      ...doc,
    });

    results.push({ row, success: true });
  }

  await tx.commit();

  return NextResponse.json({ results });
}
