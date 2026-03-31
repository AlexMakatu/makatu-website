import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import type { Metadata } from "next";

import FAQClient from "./FAQClient";

/* --------------------------
QUERY
--------------------------- */

const faqQuery = groq`
*[_type == "faq"]{
  question,
  answer,
  relatedRoutes[]{
    title,
    "slug": route->slug.current
  }
}
`;

/* --------------------------
SEO (STATIC + STRONG)
--------------------------- */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Vehicle Transport FAQs | Makatu",
    description:
      "Find answers to common questions about vehicle transport, pricing, delivery times, and routes across South Africa.",

    alternates: {
      canonical: "/faq",
    },

    openGraph: {
      title: "Vehicle Transport FAQs | Makatu",
      description:
        "Everything you need to know about transporting your vehicle safely across South Africa.",
    },
  };
}

/* --------------------------
PAGE
--------------------------- */

export default async function Page() {
  const faqs = await client.fetch(faqQuery, {}, { cache: "no-store" });

  /* 🔥 FAQ STRUCTURED DATA */
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq: { question: string; answer: string }) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* ✅ STRUCTURED DATA (CRITICAL FOR SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <FAQClient faqs={faqs} />
    </>
  );
}
