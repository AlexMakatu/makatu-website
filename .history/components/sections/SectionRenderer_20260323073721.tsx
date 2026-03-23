import { PortableText } from "@portabletext/react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

type ImageWithAlt = {
  asset: SanityImageSource;
  alt?: string;
};

type Section = {
  _type: string;
  _key: string;
  title?: string;
  content?: PortableTextBlock[];
  layout?: "imageLeft" | "imageRight";
  image?: ImageWithAlt;
  caption?: string;
  buttonText?: string;
  buttonLink?: string;
};

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case "textSection":
            return (
              <div key={section._key} className="mb-10">
                {section.title && (
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                )}

                {section.content && <PortableText value={section.content} />}
              </div>
            );

          case "imageSection":
            return (
              <div key={section._key} className="my-12">
                {section.image?.asset && (
                  <Image
                    src={urlFor(section.image.asset).width(900).url()}
                    alt={section.image.alt || ""}
                    width={900}
                    height={600}
                    className="rounded-xl w-full"
                  />
                )}

                {section.caption && (
                  <p className="text-sm text-gray-500 mt-2">
                    {section.caption}
                  </p>
                )}
              </div>
            );

          case "imageTextSection": {
            const isImageLeft = section.layout === "imageLeft";

            const text = (
              <div>
                {section.content && <PortableText value={section.content} />}
              </div>
            );

            const image = section.image?.asset && (
              <Image
                src={urlFor(section.image.asset).width(700).url()}
                alt={section.image.alt || ""}
                width={700}
                height={500}
                className="rounded-xl w-full"
              />
            );

            return (
              <div
                key={section._key}
                className="my-16 grid md:grid-cols-2 gap-10 items-center"
              >
                {isImageLeft ? (
                  <>
                    {image}
                    {text}
                  </>
                ) : (
                  <>
                    {text}
                    {image}
                  </>
                )}
              </div>
            );
          }

          case "ctaSection":
            return (
              <div
                key={section._key}
                className="my-16 p-10 bg-gray-100 rounded-xl text-center"
              >
                {section.title && (
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                )}

                {section.content && <PortableText value={section.content} />}

                {section.buttonText && section.buttonLink && (
                  <a
                    href={section.buttonLink}
                    className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg"
                  >
                    {section.buttonText}
                  </a>
                )}
              </div>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
