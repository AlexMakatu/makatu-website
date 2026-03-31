import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/* --------------------------
IMAGE BUILDER
--------------------------- */

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/* --------------------------
TYPES
--------------------------- */

type Author = {
  name: string;
  role?: string;
  bio?: string;
  image?: SanityImageSource;
};

type Post = {
  title: string;
  slug: {
    current: string;
  };
};

type Params = {
  slug: string;
};

/* --------------------------
SEO (DYNAMIC)
--------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;

  const author: Author = await client.fetch(
    groq`*[_type == "author" && slug.current == $slug][0]{
      name,
      bio
    }`,
    { slug },
  );

  if (!author) {
    return {
      title: "Author not found",
    };
  }

  return {
    title: `${author.name} | Makatu Insights`,
    description:
      author.bio ||
      `Read articles and insights by ${author.name} on vehicle transport across South Africa.`,

    alternates: {
      canonical: `/authors/${slug}`,
    },

    openGraph: {
      title: `${author.name} | Makatu`,
      description: author.bio,
    },
  };
}

/* --------------------------
PAGE
--------------------------- */

export default async function AuthorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const author: Author = await client.fetch(
    groq`*[_type == "author" && slug.current == $slug][0]{
      name,
      role,
      bio,
      image
    }`,
    { slug },
  );

  if (!author) return notFound();

  const posts: Post[] = await client.fetch(
    groq`*[_type == "blogPost" && author->slug.current == $slug] | order(_createdAt desc){
      title,
      slug
    }`,
    { slug },
  );

  /* --------------------------
  STRUCTURED DATA
  --------------------------- */

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description: author.bio,
    jobTitle: author.role,
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

      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* AUTHOR HEADER */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12 text-center sm:text-left">
          {/* IMAGE */}
          {author.image ? (
            <Image
              src={urlFor(author.image).width(200).height(200).url()}
              alt={author.name}
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200" />
          )}

          {/* INFO */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {author.name}
            </h1>

            {author.role && <p className="text-gray-500 mb-3">{author.role}</p>}

            {author.bio && (
              <p className="text-gray-700 max-w-xl">{author.bio}</p>
            )}
          </div>
        </div>

        {/* POSTS */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Articles by {author.name}
          </h2>

          {posts.length === 0 ? (
            <p className="text-gray-500">No articles published yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.slug.current}
                  href={`/blog/${post.slug.current}`}
                  className="block p-4 bg-white rounded-xl border hover:shadow-sm transition"
                >
                  {post.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
