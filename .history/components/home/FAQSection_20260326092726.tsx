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
  background = "bg-brand/10",
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={`py-20 ${background}`}>
      <div className="max-w-3xl mx-auto px-6">
        {/* HEADING BLOCK */}
        <div className="relative text-center mb-12">
          {/* BACKGROUND WORD */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[90px] md:text-[140px] font-extrabold text-brand/10 leading-none pointer-events-none select-none">
            FAQ
          </span>

          {/* FOREGROUND TITLE */}
          <h2 className="relative text-3xl md:text-4xl font-semibold text-gray-900">
            {title || "Vehicle Transport FAQs"}
          </h2>
        </div>

        {/* FAQ LIST */}
        <div className="divide-y divide-brand/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="py-6">
                {/* QUESTION */}
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

                {/* ANSWER */}
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
