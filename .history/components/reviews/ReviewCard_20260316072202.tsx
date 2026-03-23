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
    <div className="bg-white p-7 rounded-xl border shadow-sm flex flex-col justify-between hover:shadow-md transition">
      {/* Rating */}
      {review.source === "wisemove" ? (
        <div className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm font-semibold mb-3">
          {review.rating} / 10
        </div>
      ) : (
        <div className="text-yellow-500 mb-3 text-lg tracking-wide">
          {"★".repeat(review.rating)}
        </div>
      )}

      {/* Review text */}
      <p className="text-gray-700 mb-4 line-clamp-4">{review.text}</p>

      {/* Author */}
      <p className="font-semibold mb-3">— {review.author}</p>

      {/* Source */}
      <div className="flex items-center gap-2 mt-auto text-sm">
        <img src={logos[review.source]} alt={review.source} className="h-5" />

        <span className="capitalize text-gray-500">{review.source}</span>

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
  );
}
