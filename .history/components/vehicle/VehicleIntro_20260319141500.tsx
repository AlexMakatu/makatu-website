import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { Image as SanityImageType } from "sanity";
import { urlFor } from "@/sanity/lib/image";

/* ================= TYPES ================= */

type SanityImage = SanityImageType & {
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
    ? urlFor(image).width(1600).quality(90).url()
    : null;

  return (
    <section className={`${background} py-24`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* TEXT SIDE */}
          <div className="max-w-xl">
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {content && <PortableText value={content} />}
            </div>
          </div>

          {/* IMAGE SIDE */}
          {imageUrl && (
            <div className="relative">
              {/* Background Accent */}
              <div className="absolute -inset-4 bg-gray-100 rounded-2xl" />

              {/* Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={imageUrl}
                  alt={image?.alt || "Vehicle transport"}
                  width={800}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
