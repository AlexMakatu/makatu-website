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
    <main className="bg-gray-50 py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* HERO */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {page?.title || "Contact"}
          </h1>

          {page?.introText && (
            <p className="text-gray-600 leading-relaxed text-lg">
              {page.introText}
            </p>
          )}
        </div>

        {/* CONTACT GRID */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* CONTACT FORM */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Send us a message</h2>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black transition"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black transition"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black transition"
              />

              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black transition"
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* CONTACT DETAILS */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 space-y-8">
            {page?.phone && (
              <div>
                <h3 className="font-semibold text-lg mb-1">Phone</h3>

                <a
                  href={`tel:${page.phone}`}
                  className="text-gray-600 hover:text-black transition"
                >
                  {page.phone}
                </a>
              </div>
            )}

            {page?.email && (
              <div>
                <h3 className="font-semibold text-lg mb-1">Email</h3>

                <a
                  href={`mailto:${page.email}`}
                  className="text-gray-600 hover:text-black transition"
                >
                  {page.email}
                </a>
              </div>
            )}

            {page?.address && (
              <div>
                <h3 className="font-semibold text-lg mb-1">Office</h3>

                <p className="text-gray-600 whitespace-pre-line">
                  {page.address}
                </p>
              </div>
            )}

            {page?.serviceAreas && page.serviceAreas.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Service Areas</h3>

                <div className="flex flex-wrap gap-2">
                  {page.serviceAreas.map((city, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {page?.whatsappNumber && (
              <div className="pt-4">
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
        </div>

        {/* QUOTE CTA */}
        <div className="text-center mt-20">
          <p className="text-gray-700 text-lg mb-6">
            {page?.quoteCTA || "Need a vehicle transport price?"}
          </p>

          <a
            href="/quote"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </main>
  );
}
