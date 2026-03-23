import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";

type Review = {
  _id: string;
  author: string;
  rating: number;
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
        <h1 className="text-4xl font-bold text-center mb-6">
          Customer Reviews
        </h1>

        <p className="text-center text-gray-600 mb-12">
          Real feedback from customers who trusted Makatu to transport their
          vehicles.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-between"
            >
              {/* Stars */}
              <div className="text-yellow-500 mb-3 text-lg">
                {"★★★★★".slice(
                  0,
                  review.ratingScale === 10
                    ? Math.round(review.rating / 2)
                    : review.rating,
                )}
              </div>

              {/* Review text */}
              <p className="text-gray-700 mb-4">{review.text}</p>

              {/* Author */}
              <p className="font-semibold mb-3">— {review.author}</p>

              {/* Source */}
              <div className="flex items-center gap-3 mt-auto">
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
