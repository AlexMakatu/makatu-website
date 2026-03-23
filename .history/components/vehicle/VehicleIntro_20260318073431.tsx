import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/sanity/lib/image";

/* ================= TYPES ================= */

type SanityImage = {
  asset?: {
    _ref?: string;
    _type?: string;
    url?: string;
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
  const imageUrl = image?.asset?._ref
    ? urlFor(image).width(1200).quality(90).url()
    : image?.asset?.url;

  return (
    <section className={`${background} py-20`}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* IMAGE ABOVE TEXT */}
        {imageUrl && (
          <div className="relative w-full h-[260px] md:h-[360px] mb-10">
            <Image
              src={imageUrl}
              alt={image?.alt || "Vehicle transport"}
              fill
              sizes="100vw"
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}

        {/* CONTENT */}
        <div className="prose lg:prose-lg max-w-none mx-auto">
          {content && <PortableText value={content} />}
        </div>
      </div>
    </section>
  );
}
