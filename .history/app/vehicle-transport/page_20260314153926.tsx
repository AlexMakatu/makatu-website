import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

type Route = {
  _id: string;
  title: string;
  slug?: {
    current?: string;
  };
  routeImage?: {
    asset?: {
      url?: string;
    };
  };
  fromCity?: {
    name?: string;
  };
  toCity?: {
    name?: string;
  };
};

const routesQuery = groq`
*[_type == "route"] | order(title asc){
  _id,
  title,
  slug,
  routeImage{
    asset->{url}
  },
  fromCity->{name},
  toCity->{name}
}
`;

export const metadata: Metadata = {
  title: "Vehicle Transport Routes | Makatu",
  description:
    "Explore vehicle transport routes across South Africa. Reliable nationwide car transport with competitive pricing.",
};

export default async function VehicleTransportPage() {
  const routes: Route[] = await client.fetch(routesQuery);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-6">Vehicle Transport Routes</h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Makatu provides reliable vehicle transport across South Africa.
          Explore our most popular routes and request a quote for fast
          nationwide delivery.
        </p>
      </section>

      <section>
        <div className="grid md:grid-cols-3 gap-8">
          {routes.map((route) => (
            <Link
              key={route._id}
              href={`/vehicle-transport/${route.slug?.current}`}
              className="block border rounded-xl overflow-hidden hover:shadow-lg transition bg-white"
            >
              {route.routeImage?.asset?.url && (
                <Image
                  src={route.routeImage.asset.url}
                  alt={`${route.fromCity?.name} to ${route.toCity?.name} vehicle transport`}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-6 text-center">
                <h2 className="text-lg font-semibold mb-2">
                  {route.fromCity?.name} → {route.toCity?.name}
                </h2>

                <p className="text-sm text-gray-500">View route →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20 text-center">
        <h2 className="text-2xl font-bold mb-6">
          Need a Custom Vehicle Transport Quote?
        </h2>

        <p className="text-gray-600 mb-8">
          Our logistics network covers every major city in South Africa.
        </p>

        <Link
          href="/contact"
          className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Request a Quote
        </Link>
      </section>
    </main>
  );
}
