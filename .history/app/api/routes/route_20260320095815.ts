import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export async function GET() {
  const routes = await client.fetch(groq`
    *[_type == "route"]{
      slug,
      fromCity->{name},
      toCity->{name}
    }
  `);

  return Response.json(routes);
}
