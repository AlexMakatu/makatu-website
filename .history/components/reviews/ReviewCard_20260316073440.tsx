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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition p-8 flex flex-col">
      {/* Top bar */}
      <div className="text-yellow-500 text-base">
        <img src={logos[review.source]} alt={review.source} className="h-6" />

        {review.source === "wisemove" ? (
          <span className="text-sm font-semibold text-gray-700">
            {review.rating} / 10
          </span>
        ) : (
          <span className="text-yellow-500 text-lg">
            {"★".repeat(review.rating)}
          </span>
        )}
      </div>

      {/* Review text */}
      <p className="text-gray-700 leading-relaxed mb-6 before:content-['“'] before:text-3xl before:text-gray-300 before:mr-1">
        {review.text}
      </p>

      {/* Author */}
      <div className="mt-auto border-t pt-4">
        <p className="font-semibold text-gray-900 mb-2">{review.author}</p>

        {review.reviewUrl && (
          <Link
            href={review.reviewUrl}
            target="_blank"
            className="text-sm text-blue-600 hover:underline"
          >
            View review
          </Link>
        )}
      </div>
    </div>
  );
}
