"use client";

import { useState } from "react";
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

export default function FAQClient({ faqs }: { faqs: FAQ[] }) {
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
    <main className="max-w-4xl mx-auto px-4 py-16">
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
      )}

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600">
          Everything you need to know before booking.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const routes = faq.relatedRoutes ?? [];
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="border rounded-xl p-5 transition hover:shadow-sm"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <h2 className="text-lg font-semibold">{faq.question}</h2>
                <span>{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <div className="mt-4">
                  <div className="prose max-w-none mb-4">
                    <PortableText value={faq.answer} />
                  </div>

                  {routes.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {routes.map((route, i) => (
                        <li key={i}>
                          <a
                            href={`/routes/${route.slug}`}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                          >
                            {route.title}
                          </a>
                        </li>
                      ))}
                    </ul>
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
