import { PortableTextBlock } from "@portabletext/types";

export type FAQ = {
  question: string;
  answer: PortableTextBlock[]; // keep this
  relatedRoutes?: {
    title: string;
    slug: string;
  }[];
};
