import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import type { Metadata } from "next";
import Script from "next/script";

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

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogTitle?: string;
  };
};

/* --------------------------
SEO (FULLY DYNAMIC)
--------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const page: ContactPage = await client.fetch(
    groq`*[_type == "contactPage"][0]{
      title,
      introText,
      seo {
        metaTitle,
        metaDescription,
        canonicalUrl,
        ogTitle
      }
    }`,
  );

  return {
    title: page?.seo?.metaTitle || page?.title || "Contact Makatu",
    description:
      page?.seo?.metaDescription ||
      page?.introText ||
      "Contact Makatu for vehicle transport services.",

    alternates: {
      canonical: page?.seo?.canonicalUrl || "https://www.makatu.co.za/contact",
    },

    openGraph: {
      title: page?.seo?.ogTitle || page?.seo?.metaTitle,
      description: page?.seo?.metaDescription,
    },
  };
}

/* --------------------------
PAGE
--------------------------- */
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
    <div className="bg-gray-50">
      <Script
        id="breadcrumb-contact"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://www.makatu.co.za",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Contact",
              item: "https://www.makatu.co.za/contact",
            },
          ],
        })}
      </Script>
      {/* HERO */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {page?.title || "Contact Makatu"}
          </h1>

          {page?.introText && (
            <p className="text-gray-600 text-lg">{page.introText}</p>
          )}
        </div>
      </section>

      {/* CONTACT CARD */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            {/* FORM */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Send us a message</h2>

              <ContactForm />
            </div>

            {/* DETAILS */}
            <div className="space-y-6 text-sm">
              {page?.phone && (
                <div>
                  <p className="text-gray-500 uppercase text-xs mb-1">Phone</p>
                  <p className="text-gray-900 font-medium">{page.phone}</p>
                </div>
              )}

              {page?.email && (
                <div>
                  <p className="text-gray-500 uppercase text-xs mb-1">Email</p>
                  <a
                    href={`mailto:${page.email}`}
                    className="text-gray-900 font-medium hover:underline"
                  >
                    {page.email}
                  </a>
                </div>
              )}

              {page?.address && (
                <div>
                  <p className="text-gray-500 uppercase text-xs mb-1">Office</p>
                  <p className="text-gray-900 whitespace-pre-line">
                    {page.address}
                  </p>
                </div>
              )}

              {page?.serviceAreas && (
                <div>
                  <p className="text-gray-500 uppercase text-xs mb-2">
                    Service Areas
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {page.serviceAreas.map((city, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 px-3 py-1 rounded-full text-xs"
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
                  className="inline-block bg-green-500 text-white px-5 py-3 rounded-lg font-semibold mt-4 hover:opacity-90 transition"
                >
                  Chat on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 PRIMARY CTA (ESTIMATOR) */}
      <section id="estimate" className="pb-10">
        <RouteEstimateSection />
      </section>

      {/* SECONDARY CTA */}
      <section className="pb-20 text-center">
        <p className="text-gray-600 mb-3">
          {page?.quoteCTA || "Prefer to enter full details?"}
        </p>

        <a
          href="/get-a-quote"
          className="text-[#311d60] font-semibold underline underline-offset-4 hover:opacity-80"
        >
          Go to full quote form →
        </a>
      </section>
    </div>
  );
}
