import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import FAQClient from "./FAQClient";

const faqQuery = groq`*[_type == "faq"]{
  question,
  answer,
  relatedRoutes[]{
    title,
    "slug": route->slug.current
  }
}`;

export default async function Page() {
  const faqs = await client.fetch(faqQuery, {}, { cache: "no-store" });

  return <FAQClient faqs={faqs} />;
}
