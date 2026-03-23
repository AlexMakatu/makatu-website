import { PortableTextBlock } from "sanity";
import { PortableText } from "@portabletext/react";

type FAQ = {
  question?: string;
  answer?: PortableTextBlock[];
  relatedRoutes?: {
    title: string;
    slug: string;
  }[];
};

type Props = {
  faqs?: FAQ[];
  title?: string;
  background?: string;
};

export default function FAQSection({
  faqs,
  title,
  background = "bg-gray-50",
}: Props) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={`py-16 ${background}`}>
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          {title || "Vehicle Transport FAQs"}
        </h2>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>

              <div className="text-gray-600 leading-relaxed">
                <PortableText value={faq.answer || []} />
              </div>

              {/* Related Routes */}
              {faq.relatedRoutes && faq.relatedRoutes.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Related routes:
                  </p>
                  <ul className="text-sm text-purple-600 space-y-1">
                    {faq.relatedRoutes.map((route, i) => (
                      <li key={i}>
                        <a href={`/vehicle-transport/${route.slug}`}>
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
      </div>
    </section>
  );
}
