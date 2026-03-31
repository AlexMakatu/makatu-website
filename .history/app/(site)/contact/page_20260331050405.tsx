import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import ContactForm from "@/components/contact/ContactForm";
import RouteEstimateSection from "@/components/vehicle/RouteEstimateSection";

type ContactPage = {
  title?: string;
  introText?: string;
  phone?: string;
  email?: string;
  whatsappNumber?: string;
  address?: string;
  serviceAreas?: string[];
  quoteCTA?: string;
};

export default async function ContactPage() {
  const page: ContactPage = await client.fetch(
    groq`*[_type == "contactPage"][0]{
      title,
      introText,
      phone,
      email,
      whatsappNumber,
      address,
      serviceAreas,
      quoteCTA
    }`,
  );

  return (
    <main className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* HERO */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            {page?.title || "Contact"}
          </h1>

          {page?.introText && (
            <p className="text-gray-600 max-w-2xl mx-auto">{page.introText}</p>
          )}
        </div>

        {/* CONTACT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-10 rounded-xl shadow-sm">
          {/* FORM */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Send us a message</h2>

            <ContactForm />
          </div>

          {/* CONTACT DETAILS */}
          <div className="space-y-6">
            {page?.phone && (
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-600">{page.phone}</p>
              </div>
            )}

            {page?.email && (
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">{page.email}</p>
              </div>
            )}

            {page?.address && (
              <div>
                <h3 className="font-semibold">Office</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {page.address}
                </p>
              </div>
            )}

            {page?.serviceAreas && (
              <div>
                <h3 className="font-semibold mb-2">Service Areas</h3>

                <div className="flex flex-wrap gap-2">
                  {page.serviceAreas.map((city, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {page?.whatsappNumber && (
              <a
                href={`https://wa.me/${page.whatsappNumber}`}
                target="_blank"
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Chat on WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* ROUTE ESTIMATOR CTA */}
        <div className="mt-20">
          <RouteEstimateSection />
        </div>

        {/* FALLBACK CTA (important) */}
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-4">
            {page?.quoteCTA || "Prefer to enter full details?"}
          </p>

          <a
            href="/get-a-quote"
            className="inline-block text-blue-600 font-semibold underline underline-offset-4 hover:opacity-80 transition"
          >
            Go to full quote form →
          </a>
        </div>
      </div>
    </main>
  );
}
