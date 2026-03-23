import { client } from "@/sanity/lib/client";
import getVehicleTransportPageQuery from "@/sanity/queries/getVehicleTransportPageQuery";

import VehicleHero from "@/components/vehicle/VehicleHero";
import VehicleIntro from "@/components/vehicle/VehicleIntro";
import VehicleTypes from "@/components/vehicle/VehicleTypes";
import CustomerTypes from "@/components/vehicle/CustomerTypes";
import Certifications from "@/components/vehicle/certifications";
import VehicleSEOContent from "@/components/vehicle/VehicleSEOContent";
import Partners from "@/components/vehicle/Partners";
import VehicleCTA from "@/components/vehicle/VehicleCTA";
import FAQSection from "@/components/home/FAQSection";

/* ================= HELPER ================= */

function portableTextToPlainText(blocks: any[]) {
  return blocks
    ?.map((block) => block.children?.map((child: any) => child.text).join(""))
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

  const faqs = await client.fetch(`
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

  // Service schema (existing)
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

  // FAQ schema (NEW)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq: any) => ({
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
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd),
        }}
      />

      {/* FAQ Schema */}
      {faqs?.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
      )}

      {/* PAGE CONTENT */}

      <VehicleHero
        heading={data.heroHeading}
        text={data.heroText}
        image={data.heroImage}
        background={data.heroBackground}
      />

      <VehicleIntro
        content={data.introduction}
        image={data.introImage}
        background={data.introBackground}
      />

      <VehicleTypes
        items={data.vehicleTypes}
        background={data.vehicleTypesBackground}
      />

      <CustomerTypes
        items={data.customerTypes}
        background={data.customerTypesBackground}
      />

      <Certifications
        items={data.certifications}
        background={data.certificationsBackground}
      />

      <VehicleSEOContent
        content={data.seoContent}
        background={data.seoBackground}
      />

      {/* FAQ SECTION */}
      <FAQSection faqs={faqs} title="Vehicle Transport FAQs" />

      <Partners items={data.partners} background={data.partnersBackground} />

      <VehicleCTA
        title={data.ctaTitle}
        text={data.ctaText}
        background={data.ctaBackground}
      />
    </main>
  );
}
