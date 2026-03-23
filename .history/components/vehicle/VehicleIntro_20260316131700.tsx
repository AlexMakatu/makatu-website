import Image from "next/image";
import { PortableTextBlock } from "@portabletext/types";
import { PortableText } from "@portabletext/react";

type Props = {
  content?: PortableTextBlock[];
  image?: {
    asset?: { url: string };
    alt?: string;
  };
};

export default function VehicleIntro({ content, image }: Props) {
  return (
    <section className="grid md:grid-cols-2 gap-10 items-center mb-24">
      {image?.asset?.url && (
        <div className="relative w-full h-[320px]">
          <Image
            src={image.asset.url}
            alt={image.alt || "Vehicle transport service"}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      <div className="prose max-w-none">
        {content && <PortableText value={content} />}
      </div>
    </section>
  );
}
