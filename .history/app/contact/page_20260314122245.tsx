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
    <main className="bg-gray-50 py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            {page?.title || "Contact Makatu"}
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed">
            {page?.introText}
          </p>
        </div>

        {/* CONTACT CARD */}
        <div className="bg-white rounded-3xl shadow-lg grid md:grid-cols-2 overflow-hidden">
          {/* FORM SIDE */}
          <div className="p-12">
            <h2 className="text-2xl font-semibold mb-8">Send us a message</h2>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />

              <textarea
                rows={5}
                placeholder="Your Message"
                className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* INFO SIDE */}
          <div className="bg-gray-50 p-12 space-y-8">
            {page?.phone && (
              <div>
                <h3 className="text-sm text-gray-500 uppercase tracking-wide">
                  Phone
                </h3>

                <a
                  href={`tel:${page.phone}`}
                  className="text-lg font-medium hover:text-blue-600"
                >
                  {page.phone}
                </a>
              </div>
            )}

            {page?.email && (
              <div>
                <h3 className="text-sm text-gray-500 uppercase tracking-wide">
                  Email
                </h3>

                <a
                  href={`mailto:${page.email}`}
                  className="text-lg font-medium hover:text-blue-600"
                >
                  {page.email}
                </a>
              </div>
            )}

            {page?.address && (
              <div>
                <h3 className="text-sm text-gray-500 uppercase tracking-wide">
                  Office
                </h3>

                <p className="text-gray-700 whitespace-pre-line">
                  {page.address}
                </p>
              </div>
            )}

            {page?.serviceAreas && (
              <div>
                <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-3">
                  Service Areas
                </h3>

                <div className="flex flex-wrap gap-2">
                  {page.serviceAreas.map((city, i) => (
                    <span
                      key={i}
                      className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm"
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
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Chat on WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* QUOTE CTA */}
        <div className="text-center mt-24">
          <p className="text-gray-600 text-lg mb-6">
            {page?.quoteCTA || "Need a vehicle transport price?"}
          </p>

          <a
            href="/quote"
            className="inline-block bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-md"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </main>
  );
}
