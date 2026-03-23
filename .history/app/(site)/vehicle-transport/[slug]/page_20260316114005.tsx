import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type {
  PortableTextBlock,
  PortableTextListItemBlock,
  PortableTextSpan,
} from "@portabletext/types";

type City = {
  _id: string;
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
} | null;

type RouteRate = {
  vehicleType: string;
  priceType: "fixed" | "startingFrom" | "negotiable" | "quoteRequired";
  price?: number;
};

type Faq = {
  _id: string;
  question: string;
  answer?: PortableTextBlock[];
};

type LinkedRoute = {
  _id: string;
  title: string;
  slug?: {
    current?: string;
  };
};

type Route = {
  _id: string;
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
};

type SeoRoute = Pick<Route, "title" | "seoTitle" | "seoDescription">;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const routeQuery = groq`
*[_type == "route" && slug.current == $slug][0]{
  _id,
  title,
  heroText,
  transitTime,
  introduction,
  seoContent,
  routeImage{
    asset->{url}
  },
  fromCity->{_id,name},
  toCity->{_id,name},
  benefits[]{
    title,
    icon{
      asset->{url}
    }
  },
  faqs[]->{
    _id,
    question,
    answer
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
] | order(vehicleType asc) {
  vehicleType,
  priceType,
  price
}
`;

const routesFromCityQuery = groq`
*[_type == "route" && fromCity._ref == $cityId] | order(title asc)[0...8]{
  _id,
  title,
  slug
}
`;

const routesToCityQuery = groq`
*[_type == "route" && toCity._ref == $cityId] | order(title asc)[0...8]{
  _id,
  title,
  slug
}
`;

const seoQuery = groq`
*[_type == "route" && slug.current == $slug][0]{
  title,
  seoTitle,
  seoDescription
}
`;
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://makatu.co.za",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Vehicle Transport",
      item: "https://makatu.co.za/vehicle-transport",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: `${fromCity} to ${toCity} Vehicle Transport`,
      item: `https://makatu.co.za/vehicle-transport/${slug}`,
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "TransportService",
  name: "Makatu Vehicle Transport",
  serviceType: "Vehicle Transport",
  areaServed: "South Africa",
  provider: {
    "@type": "Organization",
    name: "Makatu",
    url: "https://makatu.co.za",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Vehicle Transport Services",
    itemListElement: routeRates.map((rate) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: `${formatVehicleType(rate.vehicleType)} Transport`,
      },
      price:
        rate.priceType === "fixed" || rate.priceType === "startingFrom"
          ? rate.price
          : undefined,
      priceCurrency: "ZAR",
    })),
  },
};
function formatVehicleType(value: string): string {
  const labels: Record<string, string> = {
    hatchback: "Hatchback",
    sedan: "Sedan",
    suv: "SUV",
    bakkie: "Bakkie",
    van: "Van",
    luxury: "Luxury / Exotic",
    other: "Other",
  };

  return labels[value] ?? value.charAt(0).toUpperCase() + value.slice(1);
}

function formatPriceLabel(rate: RouteRate): string {
  if (rate.priceType === "fixed" && typeof rate.price === "number") {
    return `R${rate.price}`;
  }

  if (rate.priceType === "startingFrom" && typeof rate.price === "number") {
    return `From R${rate.price}`;
  }

  if (rate.priceType === "negotiable") {
    return "Negotiable";
  }

  return "Quote Required";
}

function isPortableTextSpan(
  child: PortableTextSpan | Record<string, unknown>,
): child is PortableTextSpan {
  return typeof child === "object" && child !== null && "text" in child;
}

function blockToPlainText(
  block: PortableTextBlock | PortableTextListItemBlock,
): string {
  if (!("children" in block) || !Array.isArray(block.children)) {
    return "";
  }

  return block.children
    .filter((child): child is PortableTextSpan => isPortableTextSpan(child))
    .map((child) => child.text)
    .join("");
}

function portableTextToPlainText(blocks?: PortableTextBlock[]): string {
  if (!blocks || blocks.length === 0) {
    return "";
  }

  return blocks
    .map((block) => blockToPlainText(block))
    .filter(Boolean)
    .join(" ");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const route: SeoRoute | null = await client.fetch(seoQuery, { slug });

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

  const routeRates: RouteRate[] =
    fromCity && toCity
      ? await client.fetch(routeRatesQuery, { fromCity, toCity })
      : [];

  const routesFromCity: LinkedRoute[] = route.fromCity?._id
    ? await client.fetch(routesFromCityQuery, { cityId: route.fromCity._id })
    : [];

  const routesToCity: LinkedRoute[] = route.toCity?._id
    ? await client.fetch(routesToCityQuery, { cityId: route.toCity._id })
    : [];

  const filteredRoutesFromCity = routesFromCity.filter(
    (linkedRoute) =>
      linkedRoute._id !== route._id && Boolean(linkedRoute.slug?.current),
  );

  const filteredRoutesToCity = routesToCity.filter(
    (linkedRoute) =>
      linkedRoute._id !== route._id && Boolean(linkedRoute.slug?.current),
  );

  const availableVehicleTypes = Array.from(
    new Set(routeRates.map((rate) => formatVehicleType(rate.vehicleType))),
  );

  const faqSchema =
    route.faqs && route.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: route.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: portableTextToPlainText(faq.answer),
            },
          })),
        }
      : null;

  return (
    <main>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

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

        <div className="relative z-10 max-w-3xl px-6 py-16">
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
          <div className="bg-gray-100 rounded-xl p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Typical Transit Time</h2>
            <p className="text-gray-700 text-lg">{route.transitTime} days</p>
          </div>
        </section>
      )}

      {routeRates.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Estimated Transport Price</h2>

          <div className="border rounded-xl overflow-hidden bg-white">
            {routeRates.map((rate, index) => (
              <div
                key={`${rate.vehicleType}-${index}`}
                className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
              >
                <span className="font-medium text-gray-900">
                  {formatVehicleType(rate.vehicleType)}
                </span>

                <span className="text-gray-700">{formatPriceLabel(rate)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Route Information</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">From</p>
            <p className="font-semibold text-gray-900">{fromCity}</p>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">To</p>
            <p className="font-semibold text-gray-900">{toCity}</p>
          </div>

          {route.transitTime && (
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Typical Transit Time</p>
              <p className="font-semibold text-gray-900">
                {route.transitTime} days
              </p>
            </div>
          )}

          {availableVehicleTypes.length > 0 && (
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">
                Available Vehicle Types
              </p>
              <p className="font-semibold text-gray-900">
                {availableVehicleTypes.join(", ")}
              </p>
            </div>
          )}
        </div>
      </section>

      {route.introduction && (
        <section className="max-w-4xl mx-auto px-6 pb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            {route.introduction}
          </p>
        </section>
      )}

      {route.benefits &&
        route.benefits.filter((benefit) => benefit?.title).length > 0 && (
          <section className="max-w-4xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold mb-6">Why Choose Makatu</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {route.benefits
                .filter((benefit): benefit is NonNullable<Benefit> =>
                  Boolean(benefit?.title),
                )
                .map((benefit, index) => (
                  <div
                    key={`${benefit.title}-${index}`}
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

                      <p className="font-medium text-gray-900">
                        {benefit.title}
                      </p>
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
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>

                {faq.answer && faq.answer.length > 0 && (
                  <div className="prose max-w-none">
                    <PortableText value={faq.answer} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {filteredRoutesFromCity.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">
            Other Routes From {fromCity}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredRoutesFromCity.map((linkedRoute) => (
              <Link
                key={linkedRoute._id}
                href={`/vehicle-transport/${linkedRoute.slug?.current}`}
                className="block bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <p className="font-medium text-gray-900">{linkedRoute.title}</p>
                <p className="text-sm text-gray-500 mt-2">View route →</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {filteredRoutesToCity.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Routes To {toCity}</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredRoutesToCity.map((linkedRoute) => (
              <Link
                key={linkedRoute._id}
                href={`/vehicle-transport/${linkedRoute.slug?.current}`}
                className="block bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <p className="font-medium text-gray-900">{linkedRoute.title}</p>
                <p className="text-sm text-gray-500 mt-2">View route →</p>
              </Link>
            ))}
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
