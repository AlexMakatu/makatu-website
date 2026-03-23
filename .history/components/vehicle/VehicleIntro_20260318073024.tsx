import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/sanity/lib/image";

/* ================= TYPES ================= */

type SanityImage = {
  asset?: {
    _ref?: string;
    _type?: string;
  };
  alt?: string;
};

type Props = {
  content?: PortableTextBlock[];
  image?: SanityImage;
  background?: string;
};

/* ================= COMPONENT ================= */

export default function VehicleIntro({
  content,
  image,
  background = "bg-white",
}: Props) {
  const hasImage = !!image?.asset?._ref;

  return (
    <section className={`${background} py-20`}>
      <div
        className={`max-w-6xl mx-auto px-6 grid ${
          hasImage ? "md:grid-cols-2" : "md:grid-cols-1"
        } gap-12 items-center`}
      >
        {/* IMAGE */}
        {image?.asset?._ref && (
          <div className="relative w-full h-[360px] md:h-[420px]">
            <Image
              src={urlFor(image).width(800).quality(90).url()}
              alt={image.alt || "Vehicle transport logistics"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-lg"
            />
          </div>
        )}

        {/* CONTENT */}
        <div
          className={`prose lg:prose-lg max-w-none ${
            !hasImage ? "mx-auto text-center" : ""
          }`}
        >
          {content && <PortableText value={content} />}
        </div>
      </div>
    </section>
  );
}
