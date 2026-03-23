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
    <main className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* HERO */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-6">Contact</h1>

          <p className="text-gray-600 leading-relaxed">
            Have questions about vehicle transport? Our team is here to help.
            Contact Makatu for reliable car transport services across South
            Africa, including Johannesburg, Durban, Cape Town and more.
          </p>
        </div>

        {/* CONTACT GRID */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* FORM */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border">
            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
              />

              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
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
          <div className="bg-white p-10 rounded-2xl shadow-sm border space-y-8">
            <div>
              <h3 className="font-semibold text-lg mb-1">Phone</h3>
              <p className="text-gray-600">0872451140</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-1">Email</h3>
              <p className="text-gray-600">info@makatu.co.za</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-1">Office</h3>
              <p className="text-gray-600">
                12 La Bri, Petrus Street
                <br />
                Moreleta Park, Pretoria
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Service Areas</h3>

              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  Pretoria
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  Johannesburg
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  Bloemfontein
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  Durban
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  Cape Town
                </span>
              </div>
            </div>

            <a
              href="https://wa.me/27872451140"
              target="_blank"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* QUOTE CTA */}
        <div className="text-center mt-20">
          <p className="text-gray-700 mb-4">Need a vehicle transport price?</p>

          <a
            href="/quote"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </main>
  );
}
