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
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* SEO Schema */}
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
      )}

      <h1 className="text-3xl font-bold mb-10">Frequently Asked Questions</h1>

      <div className="space-y-10">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-3">{faq.question}</h2>

            <div className="prose max-w-none mb-4">
              <PortableText value={faq.answer} />
            </div>

            {/* Related Routes (SEO gold btw) */}
            {faq.relatedRoutes && faq.relatedRoutes.length > 0 && (
              <div className="text-sm">
                <span className="font-medium">Related routes: </span>
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  {faq.relatedRoutes.map((route, i) => (
                    <li key={i}>
                      <a
                        href={`/routes/${route.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        {route.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
