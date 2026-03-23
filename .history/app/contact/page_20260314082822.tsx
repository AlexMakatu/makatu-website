import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import QuoteForm from "@/components/forms/QuoteForm";

type ContactPage = {
  title?: string;
  introText?: string;
  whatsappNumber?: string;
};

export default async function ContactPage() {
  const page: ContactPage = await client.fetch(
    groq`*[_type == "contactPage"][0]{
      title,
      introText,
      whatsappNumber
    }`,
  );

  return (
    <main className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">{page?.title}</h1>

          <p className="text-gray-600">{page?.introText}</p>
        </div>

        <div className="bg-white p-10 rounded-xl shadow border max-w-3xl mx-auto">
          <QuoteForm />
        </div>

        {page?.whatsappNumber && (
          <div className="text-center mt-12">
            <a
              href={`https://wa.me/${page.whatsappNumber}`}
              target="_blank"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Chat on WhatsApp
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
