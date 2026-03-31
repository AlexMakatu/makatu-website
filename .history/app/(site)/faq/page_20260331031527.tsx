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

export default async function FAQPage() {
  const faqs: FAQ[] = await client.fetch(faqQuery, {}, { cache: "no-store" });

  /* ---------------- FAQ SCHEMA ---------------- */

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
      {/* SEO Schema */}
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

      {/* FAQ LIST */}
      <div className="space-y-10">
        {faqs.map((faq, index) => {
          const routes = faq.relatedRoutes ?? []; // ✅ FIX

          return (
            <div key={index} className="border-b pb-8">
              <h2 className="text-xl font-semibold mb-3">{faq.question}</h2>

              <div className="prose max-w-none mb-4">
                <PortableText value={faq.answer} />
              </div>

              {/* Related Routes */}
              {routes.length > 0 && (
                <div className="text-sm mt-4">
                  <span className="font-medium">Related routes:</span>

                  <ul className="mt-2 flex flex-wrap gap-2">
                    {routes.map((route, i) => (
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
          );
        })}
      </div>
    </main>
  );
}
