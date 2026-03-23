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

type Benefit = {
  title?: string;
  icon?: SanityImage;
};

type RouteRate = {
  vehicleType: string;
  priceType: string;
  price?: number;
};

type Faq = {
  _id: string;
  question: string;
  answer?: PortableTextBlock[];
  icon?: SanityImage;
};

type RelatedRoute = {
  _id: string;
  title: string;
  slug?: {
    current?: string;
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
  benefits?: Benefit[];
  seoContent?: string;
  seoTitle?: string;
  seoDescription?: string;
  faqs?: Faq[];
  relatedRoutes?: RelatedRoute[];
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
  seoContent,
  routeImage{
    asset->{url}
  },
  fromCity->{name},
  toCity->{name},
  benefits[]{
    title,
    icon{
      asset->{url}
    }
  },
  faqs[]->{
    _id,
    question,
    answer,
    icon{
      asset->{url}
    }
  },
  relatedRoutes[]->{
    _id,
    title,
    slug
  },
  seoTitle,
  seoDescription
}
`;

const routeRatesQuery = groq`
*[_type == "routeRate"
  && fromCity->name == $fromCity
  && toCity->name == $toCity
  && active == true
]{
  vehicleType,
  priceType,
  price
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

  const routeRates: RouteRate[] = await client.fetch(routeRatesQuery, {
    fromCity,
    toCity,
  });

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

        <div className="absolute inset-0 bg-black/50"></div>

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

      {/* ESTIMATED PRICE */}

      {routeRates && routeRates.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Estimated Transport Price</h2>

          <div className="border rounded-xl overflow-hidden">
            {routeRates.map((rate, index) => {
              let priceLabel = "Quote Required";

              if (rate.priceType === "fixed" && rate.price) {
                priceLabel = `R${rate.price}`;
              }

              if (rate.priceType === "startingFrom" && rate.price) {
                priceLabel = `From R${rate.price}`;
              }

              if (rate.priceType === "negotiable") {
                priceLabel = "Negotiable";
              }

              return (
                <div
                  key={index}
                  className="flex justify-between border-b px-6 py-4"
                >
                  <span className="font-medium">{rate.vehicleType}</span>

                  <span className="text-gray-700">{priceLabel}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* INTRO */}

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

          <div className="grid md:grid-cols-2 gap-4">
            {route.benefits
              ?.filter((benefit) => benefit && benefit.title)
              .map((benefit, index) => (
                <div
                  key={`${benefit.title}-${index}`}
                  className="bg-white border rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    {benefit.icon?.asset?.url && (
                      <Image
                        src={benefit.icon.asset.url}
                        alt={benefit.title}
                        width={32}
                        height={32}
                      />
                    )}

                    <p className="font-medium text-gray-900">{benefit.title}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* FAQ */}

      {route.faqs && route.faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {route.faqs.map((faq) => (
              <div
                key={faq._id}
                className="bg-white border rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>

                {faq.answer && (
                  <div className="prose max-w-none">
                    <PortableText value={faq.answer} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RELATED ROUTES */}

      {route.relatedRoutes && route.relatedRoutes.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Related Routes</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {route.relatedRoutes.map((related) => (
              <Link
                key={related._id}
                href={`/vehicle-transport/${related.slug?.current}`}
                className="block border rounded-lg p-6 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{related.title}</h3>

                <p className="text-sm text-gray-500 mt-2">View route →</p>
              </Link>
            ))}
          </div>
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
