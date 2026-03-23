import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import RoutesSection from "@/components/home/RoutesSection";

export default async function RoutesPage() {
  const routes = await client.fetch(
    groq`*[_type == "route"]{
      slug,
      routeSummary,
      routeImage{
        asset->{url}
      },
      fromCity->{name},
      toCity->{name}
    }`,
  );

  return (
    <main>
      {/* Page header */}
      <section className="py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Vehicle Transport Routes Across South Africa
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse all available vehicle transport routes between major cities
          including Johannesburg, Cape Town and Durban.
        </p>
      </section>

      {/* All routes */}
      <RoutesSection routes={routes} />
    </main>
  );
}
