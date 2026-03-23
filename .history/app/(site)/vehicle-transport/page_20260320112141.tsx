import { client } from "@/sanity/lib/client";
import getVehicleTransportPageQuery from "@/sanity/queries/getVehicleTransportPageQuery";

import VehicleHero from "@/components/vehicle/VehicleHero";
import VehicleIntro from "@/components/vehicle/VehicleIntro";
import Certifications from "@/components/vehicle/certifications";
import VehicleSEOContent from "@/components/vehicle/VehicleSEOContent";
import Partners from "@/components/vehicle/Partners";
import VehicleCTA from "@/components/vehicle/VehicleCTA";
import FAQSection from "@/components/home/FAQSection";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import RouteEstimateSection from "@/components/vehicle/RouteEstimateSection";

import type { FAQ } from "../../types/faq";
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

      {/* CONTENT */}

      <VehicleHero
        heading={data.heroHeading}
        text={data.heroText}
        image={data.heroImage}
        background={data.heroBackground}
      />

      {/* 🔥 MAIN CONVERSION SECTION */}
      <RouteEstimateSection />

      <ProcessSection
        title={process?.title}
        description={process?.description}
        steps={process?.steps}
      />
      {/* Optional intro (keep short) */}
      <VehicleIntro
        content={data.introduction}
        image={data.introImage}
        background={data.introBackground}
      />

      {/* TRUST */}
      <ReviewsSection />

      <Certifications
        items={data.certifications}
        background={data.certificationsBackground}
      />

      {/* FAQ */}
      <FAQSection faqs={faqs} title="Vehicle Transport FAQs" />

      {/* SEO CONTENT (lower priority) */}
      <VehicleSEOContent
        content={data.seoContent}
        background={data.seoBackground}
      />

      {/* OPTIONAL TRUST */}
      <Partners items={data.partners} background={data.partnersBackground} />

      {/* FINAL CTA */}
      <VehicleCTA
        title={data.ctaTitle}
        text={data.ctaText}
        background={data.ctaBackground}
      />
    </main>
  );
}
