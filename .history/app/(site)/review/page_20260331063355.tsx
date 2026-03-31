import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import type { Metadata } from "next";

import ReviewCard from "@/components/reviews/ReviewCard";

/* --------------------------
TYPES
--------------------------- */

type Review = {
  _id: string;
  author: string;
  rating: number;
  ratingScale: number;
  text: string;
  source: "google" | "wisemove" | "hellopeter";
  reviewUrl?: string;
};

/* --------------------------
QUERY
--------------------------- */

const query = groq`
*[_type == "review"] | order(date desc){
  _id,
  author,
  rating,
  ratingScale,
  text,
  source,
  reviewUrl
}
`;

/* --------------------------
SEO
--------------------------- */

export const metadata: Metadata = {
  title: "Customer Reviews | Makatu Vehicle Transport",
  description:
    "Read real customer reviews of Makatu vehicle transport services across South Africa. Trusted, reliable, and highly rated.",

  alternates: {
    canonical: "/reviews",
  },

  openGraph: {
    title: "Makatu Customer Reviews",
    description:
      "See what customers say about our vehicle transport services across South Africa.",
  },
};

/* --------------------------
PAGE
--------------------------- */

export default async function ReviewsPage() {
  const reviews: Review[] = await client.fetch(query);

  /* --------------------------
  AGGREGATE RATING (CRITICAL)
  --------------------------- */

  const total = reviews.length;

  const avgRating =
    total > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : null;

  /* --------------------------
  STRUCTURED DATA
  --------------------------- */

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Makatu Vehicle Transport",
    aggregateRating:
      total > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: avgRating,
            reviewCount: total,
          }
        : undefined,
    review: reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: r.author,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: r.ratingScale,
      },
      reviewBody: r.text,
    })),
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* ✅ STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* HERO */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Customer Reviews
            </h1>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Real feedback from customers who trusted Makatu to transport their
              vehicles across South Africa.
            </p>

            {/* ⭐ AGGREGATE DISPLAY */}
            {avgRating && (
              <p className="mt-4 text-lg font-semibold text-gray-800">
                ⭐ {avgRating} / 5 from {total} reviews
              </p>
            )}
          </div>

          {/* REVIEWS GRID */}
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
