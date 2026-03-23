import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/sanity/lib/image";

type SanityImage = {
  asset?: {
    _ref?: string;
    url?: string;
  };
  alt?: string;
};

type Props = {
  content?: PortableTextBlock[];
  image?: SanityImage;
  background?: string;
};

export default function VehicleIntro({
  content,
  image,
  background = "bg-white",
}: Props) {
  const imageUrl = image?.asset?._ref
    ? urlFor(image).width(1600).quality(100).url()
    : image?.asset?.url;

  return (
    <section className={`${background} py-24`}>
      <div className="max-w-5xl mx-auto px-6">
        {/* IMAGE */}
        {imageUrl && (
          <div className="relative w-full h-[300px] md:h-[420px] mb-12">
            <Image
              src={imageUrl}
              alt={image?.alt || "Vehicle transport"}
              fill
              priority
              sizes="100vw"
              className="object-cover rounded-xl"
            />
          </div>
        )}

        {/* CONTENT */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="prose prose-lg max-w-none">
            {content && <PortableText value={content} />}
          </div>
        </div>
      </div>
    </section>
  );
}
