import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import RoutesSection from "@/components/home/RoutesSection";
import Script from "next/script";

/* ================= TYPES ================= */
type PriceType = "fixed" | "startingFrom" | "negotiable" | "quoteRequired";
type Route = {
  slug: { current: string };
  routeSummary?: string;
  routeImage?: {
    asset?: { url: string };
  };
  fromCity?: { name: string };
  toCity?: { name: string };
  lowestPrice?: number;
  priceType?: PriceType;
};
/* ================= METADATA ================= */

export const metadata = {
  title:
    "Car Transport Routes South Africa | Johannesburg, Cape Town, Durban | Makatu",
  description:
    "Explore vehicle transport routes across South Africa including Johannesburg, Cape Town and Durban. Compare car shipping prices and delivery options.",
  keywords: [
    "car transport routes South Africa",
    "vehicle transport Johannesburg to Cape Town",
    "car shipping Durban",
    "auto transport routes SA",
  ],
  alternates: {
    canonical: "https://www.makatu.co.za/vehicle-transport/routes",
  },
  openGraph: {
    title: "Vehicle Transport Routes South Africa | Makatu",
    description:
      "Browse all available car transport routes across South Africa with pricing and delivery insights.",
    url: "https://www.makatu.co.za/vehicle-transport/routes",
    type: "website",
    siteName: "Makatu",
  },
};

/* ================= PAGE ================= */

export default async function RoutesPage() {
  const routes: Route[] = await client.fetch(
    groq`*[_type == "route"]{
      slug,
      routeSummary,
      routeImage{
        asset->{url}
      },
      fromCity->{name},
      toCity->{name},

      "lowestPrice": *[_type == "routeRate" 
        && fromCity._ref == ^.fromCity._ref 
        && toCity._ref == ^.toCity._ref
      ] | order(price asc)[0].price,

      "priceType": *[_type == "routeRate" 
        && fromCity._ref == ^.fromCity._ref 
        && toCity._ref == ^.toCity._ref
      ] | order(price asc)[0].priceType
    }`,
  );

  /* ================= SCHEMA ================= */

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.makatu.co.za",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Vehicle Transport",
        item: "https://www.makatu.co.za/vehicle-transport",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Routes",
        item: "https://www.makatu.co.za/vehicle-transport/routes",
      },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: routes.map((route: Route, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${route.fromCity?.name ?? "City"} to ${
        route.toCity?.name ?? "City"
      }`,
      url: `https://makatu.co.za/vehicle-transport/routes/${route.slug.current}`,
    })),
  };

  return (
    <main>
      {/* ================= SEO SCHEMA ================= */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <Script
        id="routes-itemlist-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd),
        }}
      />

      {/* ================= HEADER ================= */}
      <section className="py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Vehicle Transport Routes Across South Africa
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore car transport routes between Johannesburg, Cape Town, Durban
          and other major cities. Compare vehicle shipping options, pricing
          estimates and delivery times across South Africa.
        </p>
      </section>

      {/* ================= ROUTES ================= */}
      <RoutesSection routes={routes} />

      {/* ================= SEO CONTENT ================= */}
      <section className="py-16 max-w-3xl mx-auto px-6 text-gray-600 text-sm leading-relaxed">
        <p>
          Our vehicle transport routes cover all major corridors across South
          Africa, including Johannesburg to Cape Town, Durban to Pretoria, and
          nationwide car delivery options. Whether you are relocating, buying a
          vehicle, or need professional auto transport, Makatu provides reliable
          and cost-effective solutions tailored to your route.
        </p>
      </section>
    </main>
  );
}
