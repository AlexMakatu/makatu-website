import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";

type IntroImage = {
  asset?: {
    url: string;
  };
  alt?: string;
};

type Props = {
  content?: PortableTextBlock[];
  image?: IntroImage;
  background?: string;
};

export default function VehicleIntro({
  content,
  image,
  background = "bg-white",
}: Props) {
  return (
    <section className={`${background} py-20`}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {image?.asset?.url && (
          <div className="relative w-full h-[360px]">
            <Image
              src={image.asset.url}
              alt={image.alt || "Vehicle transport logistics"}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        <div className="prose lg:prose-lg max-w-none">
          {content && <PortableText value={content} />}
        </div>
      </div>
    </section>
  );
}
