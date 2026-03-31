"use client";

import { useState } from "react";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { toPlainText } from "@portabletext/react";

/* ---------------- TYPES ---------------- */

type FAQ = {
  question: string;
  answer: PortableTextBlock[];
  relatedRoutes?: {
    title: string;
    slug: string;
  }[];
};

/* ---------------- QUERY ---------------- */

const faqQuery = groq`*[_type == "faq"] | order(_createdAt asc){
  question,
  answer,
  relatedRoutes[]{
    title,
    "slug": route->slug.current
  }
}`;

/* ---------------- PAGE ---------------- */

export default function FAQPage({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqStructuredData = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: toPlainText(faq.answer),
          },
        })),
      }
    : null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
      )}

      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600">
          Everything you need to know before booking.
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="border rounded-xl p-5 transition hover:shadow-sm"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left flex justify-between items-center"
              >
                <h2 className="text-lg font-semibold">{faq.question}</h2>
                <span className="text-xl">{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <div className="mt-4 text-gray-700">
                  <div className="prose max-w-none mb-4">
                    <PortableText value={faq.answer} />
                  </div>

                  {/* Related Routes */}
                  {faq.relatedRoutes?.length > 0 && (
                    <div className="text-sm mt-4">
                      <span className="font-medium">Related routes:</span>

                      <ul className="mt-2 flex flex-wrap gap-2">
                        {faq.relatedRoutes?.map((route, i) => (
                          <li key={i}>
                            <a
                              href={`/routes/${route.slug}`}
                              className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition"
                            >
                              {route.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

/* ---------------- SERVER FETCH ---------------- */

export async function generateStaticParams() {
  return [];
}

export async function fetchFAQs(): Promise<FAQ[]> {
  return client.fetch(faqQuery);
}
