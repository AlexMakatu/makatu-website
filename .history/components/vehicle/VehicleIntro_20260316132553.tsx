import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";

type Props = {
  content?: PortableTextBlock[];
  image?: {
    asset?: { url: string };
    alt?: string;
  };
};

export default function VehicleIntro({ content, image }: Props) {
  return (
    <section className="grid md:grid-cols-2 gap-10 items-center my-24">
      {image?.asset?.url && (
        <div className="relative h-[320px]">
          <Image
            src={image.asset.url}
            alt={image.alt || ""}
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
