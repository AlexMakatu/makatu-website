import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { Metadata } from "next";
import Link from "next/link";

type Route = {
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
  routes?: Route[];
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
      },
      routes[]->{
        title,
        slug
      }
    }`,
  );

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Hero */}

      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-4">
          {service.heroHeading || service.title}
        </h1>

        {service.heroSubheading && (
          <p className="text-lg text-gray-600">{service.heroSubheading}</p>
        )}
      </section>

      {/* Intro */}

      {service.introText && (
        <section className="mb-16">
          <p className="text-lg leading-relaxed text-gray-700">
            {service.introText}
          </p>
        </section>
      )}

      {/* Features */}

      {service.features && (
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Why Choose Makatu</h2>

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

      {/* Routes */}

      {service.routes && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            Major Vehicle Transport Routes
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {service.routes.map((route) => (
              <Link
                key={route.slug.current}
                href={`/vehicle-transport/${route.slug.current}`}
                className="block border rounded-lg p-6 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{route.title}</h3>

                <p className="text-sm text-gray-500 mt-2">
                  View route details →
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
