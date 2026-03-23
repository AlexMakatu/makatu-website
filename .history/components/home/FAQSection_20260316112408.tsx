import { PortableTextBlock } from "sanity";
import { PortableText } from "@portabletext/react";

type FAQ = {
  question?: string;
  answer?: PortableTextBlock[];
};

type Props = {
  faqs?: FAQ[];
  title?: string;
};

export default function FAQSection({ faqs, title }: Props) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
