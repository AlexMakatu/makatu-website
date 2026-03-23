import { client } from "@/sanity/lib/client";
import { getReviewsQuery } from "@/sanity/queries/getReviews";
import ReviewCard from "@/components/reviews/ReviewCard";

type Review = {
  _id: string;
  author: string;
  rating: number;
  ratingScale: 5 | 10;
  text: string;
  source: "google" | "wisemove" | "hellopeter";
  reviewUrl?: string;
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

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
