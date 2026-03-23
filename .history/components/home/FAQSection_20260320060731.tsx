"use client";

import { useState } from "react";
import { PortableTextBlock } from "sanity";
import { PortableText } from "@portabletext/react";

type FAQ = {
  question?: string;
  answer?: PortableTextBlock[];
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={`py-20 ${background}`}>
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
          {title || "Vehicle Transport FAQs"}
        </h2>

        <div className="divide-y">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="py-6">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="font-medium text-lg text-gray-900">
                    {faq.question}
                  </span>

                  <span className="text-purple-600 text-xl">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    <PortableText value={faq.answer || []} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
