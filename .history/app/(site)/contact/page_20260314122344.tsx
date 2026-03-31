import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

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

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              <textarea
                rows={4}
                placeholder="Your Message"
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg"
              >
                Send Message
              </button>
            </form>
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

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            {page?.quoteCTA || "Need a vehicle transport quote?"}
          </p>

          <a
            href="/quote"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </main>
  );
}
