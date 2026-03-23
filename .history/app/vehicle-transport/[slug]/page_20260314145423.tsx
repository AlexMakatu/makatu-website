import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

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
  transitTime?: string;
  routeImage?: SanityImage;
  fromCity?: City;
  toCity?: City;
  content?: PortableTextBlock[];
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
  routeImage{
    asset->{url}
  },
  fromCity->{name},
  toCity->{name},
  content,
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

      {/* CONTENT */}

      <section className="max-w-4xl mx-auto px-6 py-16">
        {route.transitTime && (
          <div className="bg-gray-100 rounded-lg p-6 mb-10">
            <h2 className="font-semibold text-lg mb-2">Typical Transit Time</h2>
            <p className="text-gray-700">{route.transitTime}</p>
          </div>
        )}

        {route.content && route.content.length > 0 && (
          <div className="prose max-w-none">
            <PortableText value={route.content} />
          </div>
        )}
      </section>

      {/* CTA */}

      <section className="bg-gray-900 text-white py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Get a Quote for {fromCity} to {toCity}
          </h2>

          <p className="text-gray-300 mb-8">
            Fast, secure vehicle transport across South Africa.
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
