import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);
function renderWithLinks(text: string) {
  const parts = text.split(/(\/[a-z0-9\-\/]+)/gi);

  return parts.map((part, i) => {
    if (part.startsWith("/")) {
      return (
        <a
          key={i}
          href={part}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {part}
        </a>
      );
    }

    return part;
  });
}
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/* ---------------- TYPES ---------------- */

type ImageWithAlt = {
  asset: SanityImageSource;
  alt?: string;
};

type FAQItem = {
  question: string;
  answer: string;
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
  questions?: FAQItem[]; // ✅ added
};

/* ---------------- PORTABLE TEXT ---------------- */

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-8 mb-3">{children}</h3>
    ),
    normal: ({ children }) => {
      const childArray = Array.isArray(children) ? children : [children];

      const text = childArray
        .map((child) =>
          typeof child === "object" &&
          child !== null &&
          "props" in child &&
          typeof (child as { props?: { children?: unknown } }).props
            ?.children === "string"
            ? (child as { props: { children: string } }).props.children
            : typeof child === "string"
              ? child
              : "",
        )
        .join("");

      return (
        <p className="mb-5 text-gray-600 text-lg leading-8">
          {renderWithLinks(text)}
        </p>
      );
    },
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600 text-lg">
        {children}
      </ul>
    ),
  },
};

/* ---------------- COMPONENT ---------------- */

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          /* ---------- TEXT ---------- */
          case "textSection":
            return (
              <div key={section._key} className="mb-10">
                {section.title && (
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                )}

                {section.content && (
                  <PortableText
                    value={section.content}
                    components={portableTextComponents}
                  />
                )}
              </div>
            );

          /* ---------- IMAGE ---------- */
          case "imageSection":
            return (
              <div key={section._key} className="my-12">
                {section.image?.asset && (
                  <Image
                    src={urlFor(section.image.asset).width(900).url()}
                    alt={section.image.alt || ""}
                    width={900}
                    height={600}
                    className="rounded-2xl w-full object-cover aspect-[16/10] shadow-md"
                  />
                )}

                {section.caption && (
                  <p className="text-sm text-gray-500 mt-2">
                    {section.caption}
                  </p>
                )}
              </div>
            );

          /* ---------- IMAGE + TEXT ---------- */
          case "imageTextSection": {
            const isImageLeft = section.layout === "imageLeft";

            const text = (
              <div>
                {section.content && (
                  <PortableText
                    value={section.content}
                    components={portableTextComponents}
                  />
                )}
              </div>
            );

            const image = section.image?.asset && (
              <Image
                src={urlFor(section.image.asset).width(700).url()}
                alt={section.image.alt || ""}
                width={700}
                height={500}
                className="rounded-2xl w-full object-cover aspect-[16/10] shadow-md"
              />
            );

            return (
              <div
                key={section._key}
                className="my-5 grid md:grid-cols-2 gap-10 items-center"
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

          /* ---------- FAQ ---------- */
          case "faqSection":
            return (
              <div key={section._key} className="my-16">
                {section.title && (
                  <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
                )}

                {section.questions && section.questions.length > 0 && (
                  <div className="space-y-4">
                    {section.questions.map((q, i) => (
                      <div
                        key={i}
                        className="border rounded-lg p-4 bg-white shadow-sm"
                      >
                        <h3 className="font-semibold text-lg">{q.question}</h3>
                        <p className="text-gray-600 mt-2">{q.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );

          /* ---------- CTA ---------- */
          case "ctaSection":
            return (
              <div
                key={section._key}
                className="my-5 p-10 bg-gray-100 rounded-xl text-center"
              >
                {section.title && (
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                )}

                {section.content && (
                  <PortableText
                    value={section.content}
                    components={portableTextComponents}
                  />
                )}

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
