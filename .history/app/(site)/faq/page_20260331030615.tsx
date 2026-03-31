import Head from "next/head";

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Shipping typically takes 3–5 business days depending on your location.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, EFT, and secure online payments.",
  },
  {
    question: "Can I return a product?",
    answer:
      "Yes, returns are accepted within 14 days of delivery, provided the item is unused and in original packaging.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you will receive a tracking link via email.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Currently, we only ship within South Africa. International shipping is coming soon.",
  },
];

export default function FAQPage() {
  return (
    <>
      <Head>
        <title>FAQ | Your Brand Name</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about orders, shipping, payments, and more."
        />

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">{faq.question}</h2>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
