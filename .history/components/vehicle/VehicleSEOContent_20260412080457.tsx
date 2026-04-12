import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import Link from "next/link";

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

const components: PortableTextComponents = {
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
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-semibold mt-10 mb-4 text-gray-900">
        {children}
      </h2>
    ),

    normal: ({ children }) => (
      <p className="text-gray-600 leading-relaxed mb-6">{children}</p>
    ),
  },

  marks: {
    link: ({ value, children }) => {
      const href = value?.href || "#";
      const isExternal = href.startsWith("http");

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand font-medium underline hover:opacity-80 transition"
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          href={href}
          className="text-brand font-medium underline hover:opacity-80 transition"
        >
          {children}
        </Link>
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

        {/* 🔥 INTERNAL LINKING (Durban Focus) */}
        <div className="mt-12 border-t pt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Popular vehicle transport routes
          </h3>

          <div className="grid sm:grid-cols-2 gap-3 text-sm md:text-base">
            <Link
              href="/vehicle-transport/durban-to-johannesburg-vehicle-transport"
              className="text-brand hover:underline"
            >
              Car transport from Durban to Johannesburg
            </Link>

            <Link
              href="/vehicle-transport/johannesburg-to-durban-vehicle-transport"
              className="text-brand hover:underline"
            >
              Car transport from Johannesburg to Durban
            </Link>

            <Link
              href="/vehicle-transport/durban-to-pretoria-vehicle-transport"
              className="text-brand hover:underline"
            >
              Car transport from Durban to Pretoria
            </Link>

            <Link
              href="/vehicle-transport/pretoria-to-durban-vehicle-transport"
              className="text-brand hover:underline"
            >
              Car transport from Pretoria to Durban
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/get-a-quote"
            className="inline-block bg-brand text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
          >
            Get Your Instant Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
