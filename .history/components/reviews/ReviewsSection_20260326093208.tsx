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

  // ✅ Shuffle reviews so page feels natural
  const shuffledReviews = [...reviews].sort(() => 0.5 - Math.random());

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADING */}
        <div className="relative text-center mb-14">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[90px] md:text-[140px] font-extrabold text-brand/10 leading-none pointer-events-none select-none">
            REVIEWS
          </span>

          <h2 className="relative text-4xl font-bold text-gray-900 mb-3">
            What Our Customers Say
          </h2>

          <p className="text-gray-600 max-w-xl mx-auto">
            Real feedback from people who trusted Makatu to transport their
            vehicles safely across South Africa.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-10">
          {shuffledReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-[0_20px_50px_rgba(49,29,96,0.08)] transition p-8 flex flex-col"
            >
              {/* TOP */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={logos[review.source]}
                    alt={review.source}
                    className="h-8 w-auto object-contain opacity-80 grayscale hover:grayscale-0 transition"
                  />

                  <span className="text-xs text-gray-500 capitalize">
                    {review.source}
                  </span>
                </div>

                {/* Rating display */}
                {review.source === "wisemove" ? (
                  <span className="text-sm font-semibold text-gray-800">
                    {review.rating} / 10
                  </span>
                ) : review.source === "google" ? (
                  <span className="text-yellow-500 text-lg">
                    {"★".repeat(review.rating)}
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-green-600">
                    Verified
                  </span>
                )}
              </div>

              {/* TEXT */}
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
                    className="text-sm text-brand hover:underline mt-2 inline-block"
                  >
                    Read full review →
                  </Link>
                )}
              </div>

              {/* AUTHOR */}
              <div className="mt-auto border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-900">{review.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
