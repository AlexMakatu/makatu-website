// components/vehicle/VehicleIntro.tsx

import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/sanity/lib/image";

/* ================= TYPES ================= */

type SanityImage = {
  asset?: {
    _ref?: string;
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
  const hasImage = Boolean(image?.asset?._ref);

  return (
    <section className={`${background} py-20`}>
      <div className="max-w-5xl mx-auto px-6">
        {/* IMAGE */}
       {hasImage && image && (
  <div className="relative w-full h-[280px] md:h-[420px] mb-12">
    <Image
      src={urlFor(image).width(1400).quality(90).url()}
      alt={image.alt || "Vehicle transport"}
      fill
      priority
      sizes="100vw"
      className="object-cover rounded-xl"
    />
  </div>
)}
          </div>
        )}

        {/* CONTENT */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="prose lg:prose-lg max-w-none">
            {content && <PortableText value={content} />}
          </div>
        </div>
      </div>
    </section>
  );
}
