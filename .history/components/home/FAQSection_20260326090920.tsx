"use client";

import { useState } from "react";
import { PortableTextBlock } from "@portabletext/types";
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
  background = "bg-gradient-to-b from-white to-brand-softer",
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={`py-20 ${background}`}>
      <div className="max-w-3xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-gray-900">
          {title || "Vehicle Transport FAQs"}
        </h2>

        {/* FAQ List */}
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="py-6">
                {/* Question */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="font-medium text-lg text-gray-900">
                    {faq.question}
                  </span>

                  <span className="text-brand text-2xl font-light">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {/* Answer */}
                {isOpen && (
                  <div className="mt-4 text-gray-700 leading-relaxed">
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
