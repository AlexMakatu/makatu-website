import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";

type ImageBlock = {
  _type: "image";
  asset?: {
    url: string;
  };
  alt?: string;
};

type Props = {
  content?: PortableTextBlock[];
  background?: string;
};

const components = {
  types: {
    image: ({ value }: { value: ImageBlock }) => {
      if (!value?.asset?.url) return null;

      return (
        <div className="relative w-full h-[320px] md:h-[420px] my-10">
          <Image
            src={value.asset.url}
            alt={value.alt || "Vehicle transport"}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      );
    },
  },

  block: {
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-2xl md:text-3xl font-semibold mt-10 mb-4 text-gray-900">
        {children}
      </h2>
    ),

    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="text-gray-600 leading-relaxed mb-6">{children}</p>
    ),
  },

  marks: {
    link: ({
      value,
      children,
    }: {
      value?: { href?: string };
      children: React.ReactNode;
    }) => {
      const href = value?.href || "#";

      return (
        <a
          href={href}
          className="text-brand font-medium underline hover:opacity-80 transition"
        >
          {children}
        </a>
      );
    },
  },
};

export default function VehicleSEOContent({
  content,
  background = "bg-white",
}: Props) {
  if (!content || content.length === 0) return null;

  return (
    <section className={`${background} py-16 md:py-20`}>
      <div className="max-w-4xl mx-auto px-6">
        {/* SEO CONTENT */}
        <div className="prose prose-neutral lg:prose-lg max-w-none">
          <PortableText value={content} components={components} />
        </div>

        {/* CTA (CRITICAL FOR CONVERSION) */}
        <div className="mt-12 text-center">
          <a
            href="/get-a-quote"
            className="inline-block bg-brand text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
          >
            Get Your Instant Quote
          </a>
        </div>
      </div>
    </section>
  );
}
