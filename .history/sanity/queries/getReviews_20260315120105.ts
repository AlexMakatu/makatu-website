import { groq } from "next-sanity";

export const getReviewsQuery = groq`
*[_type == "review" && featured == true] | order(date desc)[0..5]{
  _id,
  author,
  rating,
  text,
  source,
  reviewUrl,
  date
}
`;
