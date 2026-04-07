import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Link from "next/link";
const builder = imageUrlBuilder(client);

function isRoutePath(path: string) {
  return path.startsWith("/vehicle-transport");
}

function extractRoutes(text: string) {
  const matches = text.match(/\/vehicle-transport\/[a-z0-9\-]+/gi) || [];
  return matches;
}

function RouteCards({ routes }: { routes: string[] }) {
  if (!routes.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 mt-6">
      {routes.map((route, i) => (
        <Link
          key={i}
          href={route}
          className="block p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition"
        >
          <div className="text-base font-semibold text-gray-900">
            {formatRouteLabel(route)}
          </div>

          <div className="text-sm text-gray-500 mt-1">View route details →</div>
        </Link>
      ))}
    </div>
  );
}

function formatRouteLabel(path: string) {
  const parts = path.split("/").filter(Boolean);

  if (parts.length >= 2 && parts[0] === "vehicle-transport") {
    const route = parts[1];
    const [from, to] = route.split("-to-");

    const format = (str: string) =>
      str
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    if (from && to) {
      return `${format(from)} → ${format(to)} Vehicle Transport`;
    }
  }

  if (path === "/get-a-quote") {
    return "Get a Quote";
  }

  return path;
}

function renderWithLinks(text: string) {
  const parts = text.split(/(\/[a-z0-9\-\/]+)/gi);

  return parts.map((part, i) => {
    if (part.startsWith("/")) {
      return (
        <span key={i}>
          <a
            href={part}
            className="font-semibold text-black underline decoration-2 underline-offset-4 hover:opacity-70"
          >
            {formatRouteLabel(part)}
          </a>{" "}
        </span>
      );
    }

    return <span key={i}>{part}</span>;
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
  heading?: string; //
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
  marks: {
    link: ({ value, children }) => {
      return (
        <a
          href={value?.href}
          className="font-semibold text-black underline decoration-2 underline-offset-4 hover:opacity-70"
        >
          {children}
        </a>
      );
    },
  },

  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-8 mb-3">{children}</h3>
    ),
    normal: ({ children }) => {
      const text = Array.isArray(children)
        ? children.join("")
        : String(children);

      const lines = text.split("\n");

      return (
        <div className="mb-5 text-gray-600 text-lg leading-8 space-y-2">
          {lines.map((line, i) => {
            const trimmed = line.trim();

            // ❌ hide route URLs
            if (trimmed.startsWith("/vehicle-transport")) return null;

            // ❌ hide raw get-a-quote
            if (trimmed === "/get-a-quote") return null;

            return <div key={i}>{line}</div>;
          })}
        </div>
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

  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
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
              <div key={section._key} className="my-16">
                {section.heading && (
                  <h2 className="text-3xl font-bold mb-6">{section.heading}</h2>
                )}

                {section.content && (
                  <>
                    <PortableText
                      value={section.content}
                      components={portableTextComponents}
                    />

                    {(() => {
                      const rawText = JSON.stringify(section.content);
                      const routes = extractRoutes(rawText);

                      return routes.length > 0 ? (
                        <div className="mt-6">
                          <RouteCards routes={routes} />
                        </div>
                      ) : null;
                    })()}
                  </>
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
                  <>
                    <PortableText
                      value={section.content}
                      components={portableTextComponents}
                    />

                    {(() => {
                      const rawText = JSON.stringify(section.content);
                      const routes = extractRoutes(rawText);

                      return routes.length > 0 ? (
                        <div className="mt-6">
                          <RouteCards routes={routes} />
                        </div>
                      ) : null;
                    })()}
                  </>
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
                {section.heading && (
                  <h2 className="text-2xl font-bold mb-6">{section.heading}</h2>
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
                  <a
                    href={section.buttonLink}
                    className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90"
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
