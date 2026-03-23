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
    <main className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* HERO */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">
            {page?.title || "Contact Makatu"}
          </h1>

          <p className="text-gray-600">{page?.introText}</p>
        </div>

        {/* CONTACT GRID */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* CONTACT FORM */}
          <div className="bg-white p-10 rounded-xl shadow border">
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border rounded-lg p-3"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-lg p-3"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border rounded-lg p-3"
              />

              <textarea
                placeholder="Your Message"
                className="w-full border rounded-lg p-3 h-32"
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
          <div className="bg-white p-10 rounded-xl shadow border space-y-6">
            {page?.phone && (
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-gray-600">{page.phone}</p>
              </div>
            )}

            {page?.email && (
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-gray-600">{page.email}</p>
              </div>
            )}

            {page?.address && (
              <div>
                <h3 className="font-semibold text-lg">Office</h3>
                <p className="text-gray-600">{page.address}</p>
              </div>
            )}

            {page?.serviceAreas && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Service Areas</h3>

                <ul className="grid grid-cols-2 gap-2 text-gray-600">
                  {page.serviceAreas.map((city, i) => (
                    <li key={i}>{city}</li>
                  ))}
                </ul>
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
        <div className="text-center mt-16">
          <p className="text-gray-700 mb-4">
            {page?.quoteCTA || "Need a vehicle transport quote?"}
          </p>

          <a
            href="/quote"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </main>
  );
}
