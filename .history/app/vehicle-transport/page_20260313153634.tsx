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
    <main style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      {/* Hero */}

      <h1>{service.heroHeading || service.title}</h1>

      {service.heroSubheading && (
        <p style={{ marginTop: "20px" }}>{service.heroSubheading}</p>
      )}

      {/* Intro */}

      {service.introText && (
        <p style={{ marginTop: "20px" }}>{service.introText}</p>
      )}

      {/* Features */}

      {service.features && service.features.length > 0 && (
        <>
          <h2 style={{ marginTop: "40px" }}>Why Choose Makatu</h2>

          <ul style={{ marginTop: "20px" }}>
            {service.features.map((feature, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <strong>{feature.title}</strong>
                {feature.description && <> — {feature.description}</>}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Routes */}

      {service.routes && service.routes.length > 0 && (
        <>
          <h2 style={{ marginTop: "40px" }}>Major Vehicle Transport Routes</h2>

          <ul style={{ marginTop: "20px" }}>
            {service.routes.map((route) => (
              <li key={route.slug.current} style={{ marginBottom: "10px" }}>
                <Link href={`/vehicle-transport/${route.slug.current}`}>
                  {route.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
