import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

type Route = {
  title: string;
  heroText?: string;
  transitTime?: string;
};

export default async function RoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const route: Route = await client.fetch(
    groq`*[_type == "route" && slug.current == $slug][0]{
      title,
      heroText,
      transitTime
    }`,
    { slug },
  );

  if (!route) {
    return <div>Route not found</div>;
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>{route.title}</h1>

      {route.heroText && <p>{route.heroText}</p>}

      {route.transitTime && (
        <p>
          <strong>Transit Time:</strong> {route.transitTime}
        </p>
      )}
    </main>
  );
}
