import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

type City = {
  name: string;
};

type SanityImage = {
  asset?: {
    url?: string;
  };
};

type Route = {
  title: string;
  heroText?: string;
  transitTime?: number;
  routeImage?: SanityImage;
  fromCity?: City;
  toCity?: City;
  introduction?: string;
  benefits?: string[];
  seoContent?: string;
  seoTitle?: string;
  seoDescription?: string;
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const routeQuery = groq`
*[_type == "route" && slug.current == $slug][0]{
  title,
  heroText,
  transitTime,
  introduction,
  benefits,
  seoContent,
  routeImage{
    asset->{url}
  },
  fromCity->{name},
  toCity->{name},
  seoTitle,
  seoDescription
}
`;

const seoQuery = groq`
*[_type == "route" && slug.current == $slug][0]{
  title,
  seoTitle,
  seoDescription
}
`;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const route = await client.fetch(seoQuery, { slug });

  return {
    title: route?.seoTitle ?? route?.title ?? "Vehicle Transport | Makatu",

    description:
      route?.seoDescription ??
      "Professional vehicle transport services across South Africa.",
  };
}

export default async function RoutePage({ params }: PageProps) {
  const { slug } = await params;

  const route: Route | null = await client.fetch(
    routeQuery,
    { slug },
    { cache: "no-store" },
  );

  if (!route) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold">Route not found</h1>
      </main>
    );
  }

  const fromCity = route.fromCity?.name ?? "";
  const toCity = route.toCity?.name ?? "";

  return (
    <main>
      {/* HERO */}

      <section className="relative min-h-[50vh] flex items-center justify-center text-white text-center">
        {route.routeImage?.asset?.url && (
          <Image
            src={route.routeImage.asset.url}
            alt={`${fromCity} to ${toCity} vehicle transport`}
            fill
            priority
            className="object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-3xl px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {fromCity} → {toCity} Vehicle Transport
          </h1>

          {route.heroText && (
            <p className="text-lg md:text-xl">{route.heroText}</p>
          )}
        </div>
      </section>

      {/* TRANSIT TIME */}

      {route.transitTime && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Typical Transit Time</h2>

            <p className="text-gray-700 text-lg">{route.transitTime} days</p>
          </div>
        </section>
      )}

      {/* INTRODUCTION */}

      {route.introduction && (
        <section className="max-w-4xl mx-auto px-6 pb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            {route.introduction}
          </p>
        </section>
      )}

      {/* BENEFITS */}

      {route.benefits && route.benefits.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Why Choose Makatu</h2>

          <ul className="grid md:grid-cols-2 gap-4">
            {route.benefits.map((benefit, index) => (
              <li
                key={index}
                className="bg-white border rounded-lg p-4 shadow-sm"
              >
                {benefit}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* SEO CONTENT */}

      {route.seoContent && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {route.seoContent}
          </p>
        </section>
      )}

      {/* CTA */}

      <section className="bg-gray-900 text-white py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Get a Quote for {fromCity} to {toCity}
          </h2>

          <p className="text-gray-300 mb-8">
            Fast, secure vehicle transport anywhere in South Africa.
          </p>

          <Link
            href="/contact"
            className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </main>
  );
}
