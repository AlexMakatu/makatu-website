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

  const route: Pick<Route, "title" | "seoTitle" | "seoDescription"> | null =
    await client.fetch(seoQuery, { slug });

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

      {route.transitTime && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Typical Transit Time</h2>
            <p className="text-gray-700 text-lg">{route.transitTime} days</p>
          </div>
        </section>
      )}

      {route.introduction && (
        <section className="max-w-4xl mx-auto px-6 pb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            {route.introduction}
          </p>
        </section>
      )}

      {route.benefits && route.benefits.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Why Choose Makatu</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {route.benefits
              ?.filter((benefit) => benefit && benefit.title)
              .map((benefit, index) => (
                <div
                  key={`${benefit.title ?? "benefit"}-${index}`}
                  className="bg-white border rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    {benefit.icon?.asset?.url && (
                      <Image
                        src={benefit.icon.asset.url}
                        alt={benefit.title ?? "Benefit icon"}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    )}
                    <p className="font-medium text-gray-900">{benefit.title}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {route.seoContent && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {route.seoContent}
          </p>
        </section>
      )}

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
                <div className="flex items-start gap-4">
                  {faq.icon?.asset?.url && (
                    <Image
                      src={faq.icon.asset.url}
                      alt={faq.question}
                      width={28}
                      height={28}
                      className="object-contain mt-1"
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-3">
                      {faq.question}
                    </h3>

                    {faq.answer && faq.answer.length > 0 && (
                      <div className="prose prose-gray max-w-none">
                        <PortableText value={faq.answer} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {route.relatedRoutes && route.relatedRoutes.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Related Routes</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {route.relatedRoutes.map((relatedRoute) => {
              if (!relatedRoute.slug?.current) {
                return null;
              }

              return (
                <Link
                  key={relatedRoute._id}
                  href={`/vehicle-transport/${relatedRoute.slug.current}`}
                  className="block bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <p className="font-medium text-gray-900">
                    {relatedRoute.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    View route details →
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="bg-gray-900 text-white py-16 text-center mt-8">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Get a Quote for {fromCity} to {toCity}
          </h2>

          <p className="text-gray-300 mb-8">
            Fast, secure vehicle transport anywhere in South Africa.
          </p>

          <Link
            href="/contact"
            className="inline-block bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </main>
  );
}
