import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import RoutesSection from "@/components/home/RoutesSection";

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

export default async function CityPage({ params }: Props) {
  const { slug } = params;

  /* ================= CITY ================= */

  const city: City = await client.fetch(
    `
    *[_type == "city" && slug.current == $slug][0]{
      name,
      slug
    }
  `,
    { slug },
  );

  if (!city) return notFound();

  /* ================= ROUTES ================= */

  const routes: Route[] = await client.fetch(
    `
    *[_type == "route" && 
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
    }
  `,
    { slug },
  );

  return (
    <main>
      {/* HERO */}
      <section className="py-20 bg-brand/5 border-b border-brand/10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Car Transport {city.name}
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
