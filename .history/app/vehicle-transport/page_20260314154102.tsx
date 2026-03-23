import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import type { Metadata } from "next";
import Link from "next/link";

type Route = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
};

type Feature = {
  title: string;
  description?: string;
};

type Service = {
  title: string;
  heroHeading?: string;
  heroSubheading?: string;
  introText?: string;
  features?: Feature[];
  seoTitle?: string;
  seoDescription?: string;
};

/* ---------------- SEO Metadata ---------------- */

export async function generateMetadata(): Promise<Metadata> {
  const service: Service = await client.fetch(
    groq`*[_type == "service" && slug.current == "vehicle-transport"][0]{
      seoTitle,
      seoDescription,
      title
    }`,
  );

  return {
    title: service?.seoTitle || service?.title || "Vehicle Transport | Makatu",

    description:
      service?.seoDescription ||
      "Nationwide vehicle transport services across South Africa.",
  };
}

/* ---------------- Page Component ---------------- */

export default async function VehicleTransportPage() {
  const service: Service = await client.fetch(
    groq`*[_type == "service" && slug.current == "vehicle-transport"][0]{
      title,
      heroHeading,
      heroSubheading,
      introText,
      features[]{
        title,
        description
      }
    }`,
  );

  const routes: Route[] = await client.fetch(
    groq`*[_type == "route"] | order(title asc)[0...8]{
      _id,
      title,
      slug
    }`,
  );

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* HERO */}

      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">
          {service.heroHeading || service.title}
        </h1>

        {service.heroSubheading && (
          <p className="text-lg text-gray-600">{service.heroSubheading}</p>
        )}
      </section>

      {/* INTRO */}

      {service.introText && (
        <section className="mb-16">
          <p className="text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto text-center">
            {service.introText}
          </p>
        </section>
      )}

      {/* FEATURES */}

      {service.features && service.features.length > 0 && (
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Why Choose Makatu
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {service.features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border rounded-lg p-6 shadow-sm"
              >
                <h3 className="font-semibold mb-2">{feature.title}</h3>

                {feature.description && (
                  <p className="text-gray-600">{feature.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ROUTES */}

      {routes && routes.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-center mb-8">
            Major Vehicle Transport Routes
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <Link
                key={route._id}
                href={`/vehicle-transport/${route.slug.current}`}
                className="block border rounded-lg p-6 hover:shadow-md transition bg-white"
              >
                <h3 className="font-semibold text-lg">{route.title}</h3>

                <p className="text-sm text-gray-500 mt-2">View route →</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}

      <section className="mt-20 text-center">
        <h2 className="text-2xl font-bold mb-6">
          Need a Vehicle Transport Quote?
        </h2>

        <p className="text-gray-600 mb-8">
          Makatu provides secure nationwide vehicle transport across South
          Africa.
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
