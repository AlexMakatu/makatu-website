import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { Metadata } from "next";

/* --------------------------
IMAGE BUILDER
--------------------------- */

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/* --------------------------
SEO
--------------------------- */

export const metadata: Metadata = {
  title: "Authors | Makatu Insights",
  description:
    "Meet the experts behind Makatu’s vehicle transport insights, guides, and industry updates across South Africa.",

  alternates: {
    canonical: "/authors",
  },

  openGraph: {
    title: "Makatu Authors",
    description:
      "Discover the team sharing expert knowledge on vehicle transport and logistics.",
  },
};

/* --------------------------
TYPES
--------------------------- */

type Author = {
  name: string;
  slug: {
    current: string;
  };
  role?: string;
  image?: SanityImageSource;
};

/* --------------------------
PAGE
--------------------------- */

export default async function AuthorsPage() {
  const authors: Author[] = await client.fetch(
    groq`*[_type == "author"] | order(name asc){
      name,
      slug,
      role,
      image
    }`,
  );

  /* --------------------------
  STRUCTURED DATA
  --------------------------- */

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Authors",
    itemListElement: authors.map((author, index) => ({
      "@type": "Person",
      position: index + 1,
      name: author.name,
      url: `/authors/${author.slug.current}`,
    })),
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* ✅ STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* HERO */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Authors</h1>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the experts behind Makatu’s insights, guides, and vehicle
            transport knowledge across South Africa.
          </p>
        </div>

        {/* AUTHORS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {authors.map((author) => (
            <Link
              key={author.slug.current}
              href={`/authors/${author.slug.current}`}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border hover:shadow-md transition"
            >
              {/* IMAGE */}
              {author.image ? (
                <Image
                  src={urlFor(author.image).width(100).height(100).url()}
                  alt={author.name}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-200" />
              )}

              {/* INFO */}
              <div>
                <p className="font-semibold text-lg text-gray-900">
                  {author.name}
                </p>

                {author.role && (
                  <p className="text-sm text-gray-500">{author.role}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
