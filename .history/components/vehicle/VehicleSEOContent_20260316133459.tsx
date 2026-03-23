import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";

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

const components = {
  types: {
    image: ({ value }: { value: ImageBlock }) => {
      if (!value?.asset?.url) return null;

      return (
        <div className="relative w-full h-[420px] my-10">
          <Image
            src={value.asset.url}
            alt={value.alt || "Vehicle transport"}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      );
    },
  },
};

export default function VehicleSEOContent({
  content,
  background = "bg-white",
}: Props) {
  if (!content) return null;

  return (
    <section className={`${background} py-20`}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="prose lg:prose-lg max-w-none">
          <PortableText value={content} components={components} />
        </div>
      </div>
    </section>
  );
}
