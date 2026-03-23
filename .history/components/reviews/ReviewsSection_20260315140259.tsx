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
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Real Customer Reviews
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >
              {/* Stars */}
              <div className="mb-2 text-yellow-500">
                {"★".repeat(review.rating)}
              </div>

              {/* Review text */}
              <p className="text-gray-700 mb-4">{review.text}</p>

              {/* Author */}
              <p className="font-semibold">— {review.author}</p>

              {/* Source */}
              <div className="flex items-center gap-2 mt-4">
                <img
                  src={logos[review.source]}
                  alt={review.source}
                  className="h-5"
                />

                {review.reviewUrl && (
                  <Link
                    href={review.reviewUrl}
                    target="_blank"
                    className="text-sm text-blue-600 underline"
                  >
                    View review
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
