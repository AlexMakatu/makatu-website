import { PortableTextBlock } from "@portabletext/types";

export type FAQ = {
  question: string;
  answer: PortableTextBlock[];
  relatedRoutes?: {
    title: string;
    slug: string;
  }[];
};
