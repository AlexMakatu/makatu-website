import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { toPlainText } from "@portabletext/react";

/* ---------------- TYPES ---------------- */

type FAQ = {
  question?: string;
  answer?: PortableTextBlock[];
};

/* ---------------- QUERY ---------------- */

const faqQuery = groq`*[_type == "homepage"][0]{
  faqs[]->{
    question,
    answer
  }
}`;

/* ---------------- PAGE ---------------- */

export default async function FAQPage() {
  const data: { faqs?: FAQ[] } = await client.fetch(
    faqQuery,
    {},
    { cache: "no-store" },
  );

  const faqs =
    data?.faqs?.filter(
      (faq): faq is { question: string; answer: PortableTextBlock[] } =>
        !!faq.question && !!faq.answer,
    ) || [];

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

      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-3">{faq.question}</h2>

            <div className="prose max-w-none">
              <PortableText value={faq.answer} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
