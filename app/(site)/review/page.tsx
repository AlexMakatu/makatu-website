import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import ReviewCard from "@/components/reviews/ReviewCard";

type Review = {
  _id: string;
  author: string;
  rating: number;
  ratingScale: number;
  text: string;
  source: "google" | "wisemove" | "hellopeter";
  reviewUrl?: string;
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

        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Real feedback from customers who trusted Makatu to transport their
          vehicles.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
