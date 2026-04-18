import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import Breadcrumbs from "@/components/ui/Breadcrumbs";
type Props = {
  params: { slug: string };
};
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
  if (!("children" in block) || !Array.isArray(block.children)) return "";

  return block.children
    .filter((child): child is PortableTextSpan => isPortableTextSpan(child))
    .map((child) => child.text)
    .join("");
}

function portableTextToPlainText(blocks?: PortableTextBlock[]): string {
  if (!blocks || blocks.length === 0) return "";

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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const route = await client.fetch(seoQuery, { slug });

  return {
    title: route?.seoTitle ?? route?.title ?? "Vehicle Transport | Makatu",
    description:
      route?.seoDescription ??
      "Professional vehicle transport services across South Africa.",

    alternates: {
      canonical: `/vehicle-transport/${slug}`,
    },
  };
}

/* ---------------------------
Page
----------------------------*/

export default async function RoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route: Route | null = await client.fetch(
    routeQuery,
    { slug },
    { cache: "no-store" },
  );

  if (!route) {
    notFound();
  }
  const vehiclePage = await client.fetch(
    vehiclePageQuery,
    {},
    { cache: "no-store" },
  );
  const contact = await client.fetch(contactSettingsQuery);

  const fromCity = route.fromCity?.name ?? "";
  const toCity = route.toCity?.name ?? "";

  const routeRates: RouteRate[] =
    fromCity && toCity
      ? await client.fetch(routeRatesQuery, { fromCity, toCity })
      : [];

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
        item: "https://www.makatu.co.za",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Vehicle Transport",
        item: "https://www.makatu.co.za/vehicle-transport",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${fromCity} to ${toCity} Vehicle Transport`,
        item: `https://www.makatu.co.za/vehicle-transport/${slug}`,
      },
    ],
  };

  return (
    <main>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Vehicle Transport", href: "/vehicle-transport" },
          {
            label: `${fromCity} to ${toCity}`,
          },
        ]}
      />
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

      {/* HERO */}
      <RouteHero
        routeImage={route.routeImage}
        heroText={route.heroText}
        fromCity={route.fromCity}
        toCity={route.toCity}
      />

      {/* INTRO */}
      <RouteIntroduction introduction={route.introduction} />

      {/* PRICING (PRIMARY) */}
      <RouteDetails
        transitTime={route.transitTime}
        rates={routeRates}
        fromCity={fromCity}
        toCity={toCity}
      />

      {/* TRUST */}
      <RouteBenefits benefits={route.benefits} />

      {/* VEHICLE TYPES */}
      <VehicleTypes items={vehiclePage?.vehicleTypes} />

      {/* FAQ */}
      <RouteFAQ faqs={route.faqs} />

      {/* WHO WE SERVE */}
      <CustomerTypes items={vehiclePage?.customerTypes} />

      {/* SEO CONTENT */}
      <RouteSEOContent seoContent={route.seoContent} />

      {/* FINAL CTA */}
      <RouteCTA fromCity={fromCity} toCity={toCity} />

      {/* RELATED */}
      <RouteRelatedRoutes routes={route.relatedRoutes} />

      {/* FLOATING CTA */}
      <FloatingQuoteCTA
        fromCity={fromCity}
        toCity={toCity}
        rates={routeRates}
      />
    </main>
  );
}
