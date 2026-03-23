import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { Metadata } from "next";

type Route = {
  title: string;
  heroText?: string;
  transitTime?: string;
  seoTitle?: string;
  seoDescription?: string;
};

type Params = {
  slug: string;
};

/* ---------------- SEO Metadata ---------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;

  const route: Route = await client.fetch(
    groq`*[_type == "route" && slug.current == $slug][0]{
      title,
      seoTitle,
      seoDescription
    }`,
    { slug },
  );

  return {
    title: route?.seoTitle || route?.title || "Vehicle Transport | Makatu",
    description:
      route?.seoDescription ||
      "Professional vehicle transport services across South Africa.",
  };
}

/* ---------------- Page Component ---------------- */

export default async function RoutePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const route: Route = await client.fetch(
    groq`*[_type == "route" && slug.current == $slug][0]{
      title,
      heroText,
      transitTime,
      seoTitle,
      seoDescription
    }`,
    { slug },
  );

  if (!route) {
    return <div>Route not found</div>;
  }

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1>{route.title}</h1>

      {route.heroText && <p style={{ marginTop: "20px" }}>{route.heroText}</p>}

      {route.transitTime && (
        <p style={{ marginTop: "20px" }}>
          <strong>Typical Transit Time:</strong> {route.transitTime}
        </p>
      )}
    </main>
  );
}
