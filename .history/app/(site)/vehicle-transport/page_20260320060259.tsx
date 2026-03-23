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

export const metadata = {
  title: "Vehicle Transport South Africa | Makatu",
  description:
    "Reliable vehicle transport services across South Africa including Johannesburg, Cape Town and Durban. Safe nationwide car transport solutions.",
};

export default async function VehicleTransportPage() {
  const data = await client.fetch(getVehicleTransportPageQuery);

  const jsonLd = {
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
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

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
