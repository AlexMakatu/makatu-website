import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";

/* ================= TYPES ================= */

type IntroImage = {
  asset?: {
    url?: string;
  };
  alt?: string;
};

type Props = {
  content?: PortableTextBlock[];
  image?: IntroImage;
  background?: string;
};

/* ================= COMPONENT ================= */

export default function VehicleIntro({
  content,
  image,
  background = "bg-white",
}: Props) {
  console.log("INTRO IMAGE DATA:", JSON.stringify(image, null, 2));

  const hasImage = !!image?.asset?.url;

  return (
    <section className={`${background} py-20`}>
      <div
        className={`max-w-6xl mx-auto px-6 grid ${
          hasImage ? "md:grid-cols-2" : "md:grid-cols-1"
        } gap-12 items-center`}
      >
        {/* IMAGE */}
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
