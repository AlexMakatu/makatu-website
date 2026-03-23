import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";

type Review = {
  _id: string;
  author: string;
  rating: number;
  ratingScale: number;
  text: string;
  source: "google" | "wisemove" | "hellopeter";
  reviewUrl?: string;
};

const logos = {
  google: "/logos/google.svg",
  wisemove: "/logos/wisemove.svg",
  hellopeter: "/logos/hellopeter.svg",
};

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

export default async function ReviewsPage() {
  const reviews: Review[] = await client.fetch(query);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Page heading */}
        <h1 className="text-4xl font-bold text-center mb-6">
          Customer Reviews
        </h1>

        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Real feedback from customers who trusted Makatu to transport their
          vehicles.
        </p>

        {/* Reviews grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-7 rounded-xl border shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              {/* Rating */}
              {review.ratingScale === 5 ? (
                <div className="text-yellow-500 mb-3 text-lg tracking-wide">
                  {"★★★★★".slice(0, review.rating)}
                </div>
              ) : (
                <div className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm font-semibold mb-3">
                  {review.rating} / {review.ratingScale}
                </div>
              )}

              {/* Review text */}
              <p className="text-gray-700 mb-4 line-clamp-4">{review.text}</p>

              {/* Author */}
              <p className="font-semibold mb-3">— {review.author}</p>

              {/* Source + link */}
              <div className="flex items-center gap-2 mt-auto text-sm">
                <img
                  src={logos[review.source]}
                  alt={review.source}
                  className="h-5"
                />

                <span className="capitalize text-gray-500">
                  {review.source}
                </span>

                {review.reviewUrl && (
                  <Link
                    href={review.reviewUrl}
                    target="_blank"
                    className="text-blue-600 underline ml-2"
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
