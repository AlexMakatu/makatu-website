import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";

type Faq = {
  _id: string;
  question: string;
  answer?: PortableTextBlock[];
};

type Props = {
  faqs?: Faq[];
};

export default function RouteFAQ({ faqs }: Props) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-6 py-6">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq._id}
            className="bg-white border rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>

            {faq.answer && (
              <div className="prose max-w-none">
                <PortableText value={faq.answer} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
