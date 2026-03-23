import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const cities = await client.fetch(
    groq`*[_type == "city" && name match $q + "*"] | order(name asc){
      _id,
      name
    }`,
    { q },
  );

  return NextResponse.json(cities);
}
