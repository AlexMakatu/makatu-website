import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Link from "next/link";

const builder = imageUrlBuilder(client);

/* ---------------- HELPERS ---------------- */

function extractText(blocks: PortableTextBlock[]): string {
  return blocks
    .map((block) => {
      if ("children" in block && Array.isArray(block.children)) {
        return block.children.map((c) => ("text" in c ? c.text : "")).join(" ");
      }
      return "";
    })
    .join(" ");
}

function extractRoutes(text: string): string[] {
  return text.match(/\/vehicle-transport\/[a-z0-9\-]+/gi) || [];
}

function formatRouteLabel(path: string) {
  const parts = path.split("/").filter(Boolean);

  if (parts[0] === "vehicle-transport" && parts[1]) {
    const [from, to] = parts[1].split("-to-");

    const format = (str: string) =>
      str
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    if (from && to) {
      return `${format(from)} → ${format(to)} Vehicle Transport`;
    }
  }

  return path;
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
  sectionKey?: string;
  heading?: string;
  content?: PortableTextBlock[];
  layout?: "imageLeft" | "imageRight";
  image?: ImageWithAlt;
  caption?: string;
  buttonText?: string;
  buttonLink?: string;
  questions?: FAQItem[];
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
    normal: ({ children }) => (
      <p className="mb-5 text-gray-600 text-lg leading-8">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600 text-lg">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
};

/* ---------------- COMPONENT ---------------- */

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        /* ---------- TEXT ---------- */
        if (section._type === "textSection") {
          // 🔥 INTERNAL LINKS FIX
          if (section.sectionKey === "internalLinks" && section.content) {
            const text = extractText(section.content);
            const routes = extractRoutes(text);

            return (
              <div key={section._key} className="mt-10">
                {routes.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {routes.map((route) => (
                      <Link
                        key={route}
                        href={route}
                        className="block p-5 rounded-xl border bg-white shadow-sm hover:shadow-md"
                      >
                        <div className="font-semibold">
                          {formatRouteLabel(route)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          View route →
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  <Link href="/get-a-quote" className="text-blue-600 text-sm">
                    Get a quote →
                  </Link>
                </div>
              </div>
            );
          }

          // ✅ NORMAL TEXT (FIXED)
          return section.content ? (
            <div key={section._key}>
              {section.heading && (
                <h2 className="text-3xl font-bold mt-12 mb-4">
                  {section.heading}
                </h2>
              )}

              <PortableText
                value={section.content}
                components={portableTextComponents}
              />
            </div>
          ) : null;
        }

        /* ---------- IMAGE ---------- */
        if (section._type === "imageSection") {
          return (
            <div key={section._key} className="my-12">
              {section.image?.asset && (
                <Image
                  src={urlFor(section.image.asset).width(900).url()}
                  alt={section.image.alt || ""}
                  width={900}
                  height={600}
                  className="rounded-2xl w-full object-cover"
                />
              )}
              {section.caption && (
                <p className="text-sm text-gray-500 mt-2">{section.caption}</p>
              )}
            </div>
          );
        }

        /* ---------- IMAGE + TEXT ---------- */
        if (section._type === "imageTextSection") {
          const isLeft = section.layout === "imageLeft";

          const text = (
            <div>
              {section.heading && (
                <h2 className="text-3xl font-bold mb-4">{section.heading}</h2>
              )}

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
              className="rounded-2xl w-full object-cover"
            />
          );

          return (
            <div
              key={section._key}
              className="my-10 grid md:grid-cols-2 gap-10 items-center"
            >
              {isLeft ? (
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
        if (section._type === "faqSection") {
          return (
            <div key={section._key} className="my-16">
              {section.heading && (
                <h2 className="text-2xl font-bold mb-6">{section.heading}</h2>
              )}

              {section.questions?.map((q) => (
                <div key={q.question} className="border rounded-lg p-4 mb-3">
                  <h3 className="font-semibold">{q.question}</h3>
                  <p className="text-gray-600 mt-2">{q.answer}</p>
                </div>
              ))}
            </div>
          );
        }

        /* ---------- CTA ---------- */
        if (section._type === "ctaSection") {
          return (
            <div
              key={section._key}
              className="my-16 p-10 bg-black text-white rounded-2xl text-center"
            >
              {section.heading && (
                <h2 className="text-2xl font-bold mb-4">{section.heading}</h2>
              )}

              {section.content && (
                <PortableText
                  value={section.content}
                  components={portableTextComponents}
                />
              )}

              {section.buttonText && section.buttonLink && (
                <Link
                  href={section.buttonLink}
                  className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-lg font-semibold"
                >
                  {section.buttonText}
                </Link>
              )}
            </div>
          );
        }

        return null;
      })}
    </>
  );
}
