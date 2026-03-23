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
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm text-gray-500 mb-2">Customer Testimonials</p>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Customer Reviews
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto">
            Real feedback from customers who trusted Makatu to transport their
            vehicles safely across South Africa.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition duration-300 p-8 flex flex-col justify-between"
            >
              {/* Quote icon */}
              <div className="text-gray-200 text-4xl leading-none mb-3">“</div>

              {/* Rating */}
              {review.source === "wisemove" ? (
                <div className="inline-flex items-center bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1 rounded-md text-sm font-semibold mb-4 w-fit">
                  {review.rating} / 10
                </div>
              ) : (
                <div className="text-yellow-500 text-lg mb-4 tracking-wide">
                  {"★".repeat(review.rating)}
                </div>
              )}

              {/* Review text */}
              <p className="text-gray-700 leading-relaxed mb-8 line-clamp-4">
                {review.text}
              </p>

              {/* Footer */}
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <p className="font-semibold text-gray-900 mb-2">
                  {review.author}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <img
                    src={logos[review.source]}
                    alt={review.source}
                    className="h-5 w-auto"
                  />

                  <span className="capitalize">{review.source}</span>

                  {review.reviewUrl && (
                    <Link
                      href={review.reviewUrl}
                      target="_blank"
                      className="text-blue-600 hover:underline ml-2"
                    >
                      View review
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
