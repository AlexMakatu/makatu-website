import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export async function GET() {
  const cities = await client.fetch(
    groq`*[_type == "city"] | order(name asc){ _id, name }`,
  );

  return NextResponse.json(cities);
}
