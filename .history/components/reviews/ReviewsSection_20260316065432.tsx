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

        {/* Review Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between"
            >
              {/* Rating */}
              {review.ratingScale === 5 ? (
                <div className="text-yellow-500 text-lg mb-4">
                  {"★".repeat(review.rating)}
                </div>
              ) : (
                <div className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md text-sm font-semibold mb-4">
                  {review.rating} / {review.ratingScale}
                </div>
              )}

              {/* Review text */}
              <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4">
                {review.text}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <p className="font-semibold text-gray-900">{review.author}</p>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src={logos[review.source]}
                    alt={review.source}
                    className="h-5 w-auto"
                  />

                  {review.reviewUrl && (
                    <Link
                      href={review.reviewUrl}
                      target="_blank"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
