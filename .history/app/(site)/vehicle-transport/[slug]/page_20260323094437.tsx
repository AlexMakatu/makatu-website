import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import type { Metadata } from "next";

import RouteHero from "@/components/routes/RouteHero";
import RouteIntroduction from "@/components/routes/RouteIntroduction";
import RouteBenefits from "@/components/routes/RouteBenefits";
import RouteSEOContent from "@/components/routes/RouteSEOContent";
import RouteFAQ from "@/components/routes/RouteFAQ";
import RouteRelatedRoutes from "@/components/routes/RouteRelatedRoutes";
import RouteCTA from "@/components/routes/RouteCTA";
import RouteDetails from "@/components/routes/RouteDetails";
import { contactSettingsQuery } from "@/sanity/queries/getContactSettings";
import VehicleTypes from "@/components/vehicle/VehicleTypes";
import CustomerTypes from "@/components/vehicle/CustomerTypes";
import FloatingQuoteCTA from "@/components/FloatingQuoteCTA";
import type {
  PortableTextBlock,
  PortableTextListItemBlock,
  PortableTextSpan,
} from "@portabletext/types";

/* ---------------------------
Types
----------------------------*/

type City = {
  _id: string;
  name: string;
};

type SanityImage = {
  asset?: {
    url?: string;
  };
  alt?: string;
};

type Benefit = {
  title?: string;
  icon?: SanityImage;
} | null;

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
  relatedRoutes?: LinkedRoute[];
};

type SeoRoute = Pick<Route, "title" | "seoTitle" | "seoDescription">;

type PageProps = {
  params: { slug: string };
};

type RouteRate = {
  vehicleType: string;
  priceType: "fixed" | "startingFrom" | "negotiable" | "quoteRequired";
  price?: number;
};

/* ---------------------------
Queries
----------------------------*/

const routeQuery = groq`
*[_type == "route" && slug.current == $slug][0]{
  _id,
  title,
  heroText,
  transitTime,
  introduction,
  seoContent,

  routeImage{
    asset->{url},
    alt
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
] | order(vehicleType asc) {
  vehicleType,
  priceType,
  price
}
`;

const vehiclePageQuery = groq`
*[_type == "vehicleTransportPage"][0]{
  vehicleTypes[]{
    title,
    description,
    icon{
      asset->{url}
    }
  },
  customerTypes[]{
    title,
    description,
    image{
      asset->{url}
    }
  }
}
`;

const seoQuery = groq`
*[_type == "route" && slug.current == $slug][0]{
  title,
  seoTitle,
  seoDescription
}
`;

/* ---------------------------
Helpers
----------------------------*/

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

/* ---------------------------
Metadata
----------------------------*/

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

/* ---------------------------
Page
----------------------------*/

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

  const vehiclePage = await client.fetch(vehiclePageQuery);
  const contact = await client.fetch(contactSettingsQuery);
  const whatsappNumber = contact?.whatsappNumber || "27833441849";
  const fromCity = route.fromCity?.name ?? "";
  const toCity = route.toCity?.name ?? "";

  const routeRates: RouteRate[] =
    fromCity && toCity
      ? await client.fetch(routeRatesQuery, { fromCity, toCity })
      : [];

  /* ---------------------------
  Structured Data
  ----------------------------*/

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
  };

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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />

      {/* CONTENT */}

      <RouteHero
        routeImage={route.routeImage}
        heroText={route.heroText}
        fromCity={route.fromCity}
        toCity={route.toCity}
      />

      <RouteIntroduction introduction={route.introduction} />

      <RouteDetails
        transitTime={route.transitTime}
        rates={routeRates}
        fromCity={fromCity}
        toCity={toCity}
      />

      {/* 🔥 MOVED HERE */}
      <VehicleTypes items={vehiclePage?.vehicleTypes} />

      <RouteBenefits benefits={route.benefits} />

      <RouteSEOContent seoContent={route.seoContent} />

      <RouteFAQ faqs={route.faqs} />

      {/* optional */}
      <CustomerTypes items={vehiclePage?.customerTypes} />

      <RouteCTA fromCity={fromCity} toCity={toCity} />

      <RouteRelatedRoutes routes={route.relatedRoutes} />
      <FloatingQuoteCTA
        fromCity={fromCity}
        toCity={toCity}
        rates={routeRates}
        whatsappNumber={whatsappNumber}
      />
    </main>
  );
}
