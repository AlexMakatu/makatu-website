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

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div
      key={review._id}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition duration-300 p-8 flex flex-col justify-between"
    >
      {/* Rating */}
      <div className="mb-5">
        {review.source === "wisemove" ? (
          <div className="inline-flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md text-sm font-semibold">
            {review.rating} / 10
          </div>
        ) : (
          <div className="text-yellow-500 text-lg tracking-wide">
            {"★".repeat(review.rating)}
          </div>
        )}
      </div>

      {/* Review text */}
      <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4">
        {review.text}
      </p>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <p className="font-semibold text-gray-900 mb-2">{review.author}</p>

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
  );
}
