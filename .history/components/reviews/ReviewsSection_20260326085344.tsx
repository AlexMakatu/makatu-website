import { client } from "@/sanity/lib/client";
import { getReviewsQuery } from "@/sanity/queries/getReviews";
import Link from "next/link";

type Review = {
  _id: string;
  author: string;
  rating: number;
  ratingScale: 5 | 10;
  text: string;
  source: "google" | "wisemove" | "hellopeter";
  reviewUrl?: string;
};

const logos = {
  google: "/logos/google.svg",
  wisemove: "/logos/wisemove.svg",
  hellopeter: "/logos/hellopeter.svg",
};

export default async function ReviewsSection() {
  const reviews: Review[] = await client.fetch(getReviewsQuery);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            What Our Customers Say
          </h2>

          <p className="text-gray-600 max-w-xl mx-auto">
            Real feedback from people who trusted Makatu to transport their
            vehicles safely across South Africa.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition p-8 flex flex-col"
            >
              {/* Top row */}
              {/* Top row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={logos[review.source]}
                    alt={review.source}
                    className="h-8 w-auto object-contain opacity-80 grayscale hover:grayscale-0 transition"
                  />
                </div>

                {review.source === "wisemove" ? (
                  <span className="text-sm font-semibold text-gray-800">
                    {review.rating} / 10
                  </span>
                ) : (
                  <span className="text-yellow-500 text-lg tracking-tight">
                    {"★".repeat(review.rating)}
                  </span>
                )}
              </div>

              {/* Review text */}
              <div className="mb-6">
                <p
                  className="text-gray-700 leading-relaxed"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {review.text}
                </p>

                {review.reviewUrl && (
                  <Link
                    href={review.reviewUrl}
                    target="_blank"
                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Read full review →
                  </Link>
                )}
              </div>

              {/* Author */}
              <div className="mt-auto border-t pt-4">
                <p className="font-semibold text-gray-900">{review.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
