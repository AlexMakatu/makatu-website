import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import RoutesSection from "@/components/home/RoutesSection";

/* --------------------------
TYPES
--------------------------- */

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type City = {
  name: string;
  slug: { current: string };
};

type Route = {
  slug?: { current?: string };
  routeSummary?: string;
  routeImage?: {
    asset?: { url?: string };
  };
  fromCity?: { name?: string };
  toCity?: { name?: string };
  lowestPrice?: number;
  priceType?: "fixed" | "startingFrom" | "negotiable" | "quoteRequired";
};

/* --------------------------
SEO (DYNAMIC)
--------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const city: City = await client.fetch(
    `*[_type == "city" && slug.current == $slug][0]{
      name
    }`,
    { slug },
  );

  if (!city) {
    return {
      title: "City not found",
    };
  }

  return {
    title: `Car Transport ${city.name} | Vehicle Shipping ${city.name}`,

    description: `Reliable vehicle transport services to and from ${city.name}. Get instant quotes and door-to-door car delivery across South Africa.`,

    alternates: {
      canonical: `/vehicle-transport/${slug}`,
    },

    openGraph: {
      title: `Vehicle Transport ${city.name} | Makatu`,
      description: `Ship your car to or from ${city.name} with trusted transport services.`,
    },
  };
}

/* --------------------------
PAGE
--------------------------- */

export default async function Page({ params }: Props) {
  const { slug } = await params;

  /* ================= CITY ================= */

  const city: City = await client.fetch(
    `*[_type == "city" && slug.current == $slug][0]{
      name,
      slug
    }`,
    { slug },
  );

  if (!city) return notFound();

  /* ================= ROUTES ================= */

  const routes: Route[] = await client.fetch(
    `*[_type == "route" && 
      (fromCity->slug.current == $slug || toCity->slug.current == $slug)
    ]{
      slug,
      routeSummary,
      routeImage{
        asset->{url}
      },
      fromCity->{name},
      toCity->{name},
      lowestPrice,
      priceType
    }`,
    { slug },
  );

  /* ================= STRUCTURED DATA ================= */

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Vehicle Transport ${city.name}`,
    areaServed: city.name,
    provider: {
      "@type": "Organization",
      name: "Makatu",
    },
  };

  return (
    <main>
      {/* ✅ STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* HERO */}
      <section className="py-20 bg-brand/5 border-b border-brand/10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Car Transport in {city.name}
          </h1>

          <p className="text-lg text-gray-600">
            Move a car to or from {city.name} with reliable door-to-door vehicle
            transport services across South Africa.
          </p>
        </div>
      </section>

      {/* ROUTES */}
      <RoutesSection routes={routes} />
    </main>
  );
}
