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

type ReviewCardProps = {
  review: Review;
};

const logos = {
  google: "/logos/google.svg",
  wisemove: "/logos/wisemove.svg",
  hellopeter: "/logos/hellopeter.svg",
};

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition p-8 flex flex-col">
      {/* Rating */}
      {review.source === "wisemove" ? (
        <div className="inline-flex items-center bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1 rounded-md text-sm font-semibold mb-4 w-fit">
          {review.rating} / 10
        </div>
      ) : (
        <div className="text-yellow-500 text-lg mb-4">
          {"★".repeat(review.rating)}
        </div>
      )}

      {/* Text */}
      <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4">
        {review.text}
      </p>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-4 mt-auto">
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
