import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export default async function RoutePage({
  params,
}: {
  params: { slug: string };
}) {
  const route = await client.fetch(
    groq`*[_type == "route" && slug.current == $slug][0]{
      title,
      heroText,
      transitTime,
      content
    }`,
    { slug: params.slug },
  );

  if (!route) {
    return <div>Route not found</div>;
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>{route.title}</h1>

      <p>{route.heroText}</p>

      <p>
        <strong>Transit Time:</strong> {route.transitTime}
      </p>

      {route.content?.map((block: any) => (
        <p key={block._key}>{block.children?.[0]?.text}</p>
      ))}
    </main>
  );
}
