import { client } from "@/sanity/lib/client";
import getVehicleTransportPageQuery from "@/sanity/queries/getVehicleTransportPageQuery";
import { groq } from "next-sanity";

import VehicleHero from "@/components/vehicle/VehicleHero";
import VehicleIntro from "@/components/vehicle/VehicleIntro";
import Certifications from "@/components/vehicle/certifications";
import VehicleSEOContent from "@/components/vehicle/VehicleSEOContent";
import Partners from "@/components/vehicle/Partners";
import VehicleCTA from "@/components/vehicle/VehicleCTA";
import FAQSection from "@/components/home/FAQSection";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import RouteEstimateSection from "@/components/vehicle/RouteEstimateSection";
import ProcessSection from "@/components/home/ProcessSection";
import RoutesSection from "@/components/home/RoutesSection";
import CityLinks from "@/components/vehicle/CityLinks";
import type { FAQ } from "../../../types/faq";
import { PortableTextBlock } from "@portabletext/types";

/* ================= HELPERS ================= */

type PortableTextChild = {
  text?: string;
};

function portableTextToPlainText(blocks: PortableTextBlock[]) {
  return blocks
    ?.map((block) =>
      "children" in block
        ? (block.children as PortableTextChild[])
            .map((child) => child.text || "")
            .join("")
        : "",
    )
    .join("\n");
}

/* ================= METADATA ================= */

export const metadata = {
  title: "Vehicle Transport South Africa | Makatu",
  description:
    "Reliable vehicle transport services across South Africa including Johannesburg, Cape Town and Durban. Safe nationwide car transport solutions.",
};

/* ================= PAGE ================= */

export default async function VehicleTransportPage() {
  const data = await client.fetch(getVehicleTransportPageQuery);

  /* ================= FETCH ROUTES ================= */

  const routes = await client.fetch(
    groq`*[_type == "route" && featuredRoute == true][0..5]{
      slug,
      routeSummary,
      routeImage{
        asset->{url}
      },
      fromCity->{name},
      toCity->{name}
    }`,
  );

  /* ================= FETCH FAQS ================= */

  const faqs: FAQ[] = await client.fetch(`
    *[_type == "faq" && "vehicleTransport" in showOn] | order(priority asc){
      question,
      answer,
      relatedRoutes[]->{
        title,
        "slug": slug.current
      }
    }
  `);

  /* ================= FETCH PROCESS ================= */

  const process = await client.fetch(
    `*[_type == "processSection" && page == "vehicleTransport"][0]`,
  );

  /* ================= SCHEMA ================= */

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Vehicle Transport",
    provider: {
      "@type": "Organization",
      name: "Makatu",
    },
    areaServed: {
      "@type": "Country",
      name: "South Africa",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: portableTextToPlainText(faq.answer),
      },
    })),
  };
  const cities = await client.fetch(
    groq`*[_type == "city"]{
    name,
    slug
  }`,
  );
  return (
    <main>
      {/* SERVICE SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd),
        }}
      />

      {/* FAQ SCHEMA */}
      {faqs?.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
      )}

      {/* 1. HERO */}
      <VehicleHero
        heading={data.heroHeading}
        text={data.heroText}
        image={data.heroImage}
        background={data.heroBackground}
      />

      {/* 2. PRICE / QUOTE */}
      <RouteEstimateSection />

      {/* 3. EXPLANATION (MOVED UP) */}
      <VehicleIntro
        content={data.introduction}
        image={data.introImage}
        background={data.introBackground}
      />

      {/* 4. ROUTES */}
      <RoutesSection routes={routes} />

      {/* 5. PROCESS */}
      <ProcessSection
        title={process?.title}
        description={process?.description}
        steps={process?.steps}
      />

      {/* 6. REVIEWS */}
      <ReviewsSection />

      {/* 7. CERTIFICATIONS */}
      <Certifications
        items={data.certifications}
        background={data.certificationsBackground}
      />

      {/* 8. FAQ */}
      <FAQSection faqs={faqs} title="Vehicle Transport FAQs" />

      {/* 9. SEO CONTENT */}
      <VehicleSEOContent
        content={data.seoContent}
        background={data.seoBackground}
      />

      {/* 10. PARTNERS */}
      <Partners items={data.partners} background={data.partnersBackground} />

      {/* 11. CTA */}
      <VehicleCTA
        title={data.ctaTitle}
        text={data.ctaText}
        background={data.ctaBackground}
      />
    </main>
  );
}
