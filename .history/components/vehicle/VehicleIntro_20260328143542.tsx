import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";

/* ================= TYPES ================= */

type SanityImage = {
  asset?: {
    url?: string;
  };
  alt?: string;
};

type Props = {
  content?: PortableTextBlock[];
  image?: SanityImage;
  background?: string;
};

/* ================= PORTABLE TEXT COMPONENTS ================= */

const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href =
        typeof value === "object" &&
        value !== null &&
        "href" in value &&
        typeof value.href === "string"
          ? value.href
          : "#";

      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
          className="text-brand underline underline-offset-4 hover:text-brand/80 transition"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};

/* ================= COMPONENT ================= */

export default function VehicleIntro({
  content,
  image,
  background = "bg-white",
}: Props) {
  const imageUrl = image?.asset?.url || null;

  return (
    <section className={`${background} py-12 md:py-16 lg:py-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid gap-10 md:gap-14 lg:grid-cols-2 lg:gap-20 items-center">
          {/* TEXT SIDE */}
          <div className="w-full max-w-none lg:max-w-xl">
            {/* LABEL */}
            <p className="text-xs sm:text-sm uppercase tracking-widest text-purple-600 font-medium mb-3 sm:mb-4">
              Nationwide Vehicle Transport
            </p>

            {/* HEADING */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight text-gray-900 mb-4 sm:mb-6">
              A smarter way to move vehicles across South Africa
            </h2>

            {/* BODY */}
            <div className="prose prose-base sm:prose-lg max-w-none text-gray-600 leading-relaxed">
              {Array.isArray(content) && content.length > 0 && (
                <PortableText
                  value={content}
                  components={portableTextComponents}
                />
              )}
            </div>
          </div>

          {/* IMAGE SIDE */}
          {imageUrl && (
            <div className="relative">
              {/* Glow (hidden on small screens) */}
              <div className="hidden sm:block absolute -inset-4 md:-inset-6 bg-gradient-to-br from-purple-100 to-transparent rounded-3xl blur-2xl opacity-40" />

              {/* Image */}
              <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl">
                <Image
                  src={imageUrl}
                  alt={image?.alt || "Vehicle transport"}
                  width={900}
                  height={600}
                  className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
