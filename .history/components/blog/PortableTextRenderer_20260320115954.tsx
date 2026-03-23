"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { PortableTextBlock } from "@portabletext/types";

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

type Props = {
  content: PortableTextBlock[];
};

const components = {
  types: {
    image: ({ value }: { value: { asset: SanityImageSource } }) => (
      <Image
        src={urlFor(value.asset).width(800).height(500).url()}
        alt=""
        width={800}
        height={500}
        className="rounded-lg my-8"
      />
    ),
  },

  block: {
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-2xl font-bold mt-10 mb-4">{children}</h2>
    ),

    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-xl font-semibold mt-8 mb-3">{children}</h3>
    ),

    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
  },

  marks: {
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-semibold">{children}</strong>
    ),
  },
};

export default function PortableTextRenderer({ content }: Props) {
  return <PortableText value={content} components={components} />;
}
