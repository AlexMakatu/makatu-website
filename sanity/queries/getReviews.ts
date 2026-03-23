import { groq } from "next-sanity";

export const getReviewsQuery = groq`
  *[_type == "review" && featured == true] 
  | order(_createdAt desc)[0...6]{
    _id,
    author,
    rating,
    ratingScale,
    text,
    source,
    reviewUrl
  }
`;
