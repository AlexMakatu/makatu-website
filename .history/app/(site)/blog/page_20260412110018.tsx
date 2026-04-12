import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/* ================= TYPES ================= */

type Slug = {
  current: string;
};

type Author = {
  name: string;
  slug: Slug;
  image?: SanityImageSource;
};

type Category = {
  title: string;
  slug: Slug;
};

type Post = {
  title: string;
  slug: Slug;
  excerpt?: string;
  publishedAt?: string;
  mainImage?: {
    asset?: {
      asset?: {
        _ref?: string;
      };
    };
    alt?: string;
  };
  author?: Author;
  category?: Category;
};

/* ================= SEO ================= */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Vehicle Transport Blog | Makatu",
    description:
      "Expert insights, pricing guides, and tips for vehicle transport across South Africa.",
    openGraph: {
      title: "Makatu Blog",
      description:
        "Learn about car transport, logistics, and pricing across South Africa.",
      type: "website",
    },
  };
}

/* ================= PAGE ================= */

export default async function BlogPage() {
  const posts: Post[] = await client.fetch(
    groq`*[_type == "blogPost" && defined(slug.current)] 
      | order(coalesce(publishedAt, _createdAt) desc){
        title,
        slug,
        excerpt,
        publishedAt,
        mainImage{
  image{
    asset->{
      url
    }
  },
  alt
},
        author->{
          name,
          slug,
          image
        },
        category->{
          title,
          slug
        }
      }`,
    {},
    { cache: "no-store" },
  );

  return (
    <main className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* ================= HERO ================= */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Insights & Guides
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Learn everything about vehicle transport, pricing, and logistics
            across South Africa.
          </p>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No articles yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Check back soon for updates.
            </p>
          </div>
        )}

        {/* ================= GRID ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <article
              key={post.slug.current}
              className="group bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300"
            >
              {/* IMAGE */}
              {post.mainImage?.image?.asset?.url && (
                <div className="relative overflow-hidden">
                  <Image
                    src={post.mainImage.image.asset.url}
                    alt={post.mainImage.alt || post.title}
                    width={800}
                    height={500}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>
              )}

              <div className="p-6">
                {/* CATEGORY */}
                {post.category && (
                  <Link
                    href={`/blog/category/${post.category.slug.current}`}
                    className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md"
                  >
                    {post.category.title}
                  </Link>
                )}

                {/* TITLE */}
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="block text-lg font-bold mt-3 leading-snug group-hover:text-blue-600 transition"
                >
                  {post.title}
                </Link>

                {/* EXCERPT */}
                {post.excerpt && (
                  <p className="text-gray-600 mt-3 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                {/* FOOTER */}
                <div className="flex items-center justify-between mt-5">
                  {/* AUTHOR */}
                  {post.author && (
                    <div className="flex items-center gap-2">
                      {post.author.image && (
                        <Image
                          src={urlFor(post.author.image)
                            .width(40)
                            .height(40)
                            .url()}
                          alt={post.author.name}
                          width={40}
                          height={40}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      )}

                      <span className="text-sm text-gray-500">
                        {post.author.name}
                      </span>
                    </div>
                  )}

                  {/* DATE */}
                  {post.publishedAt && (
                    <span className="text-xs text-gray-400">
                      {new Date(post.publishedAt).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="inline-block mt-6 text-blue-600 font-semibold group-hover:underline"
                >
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
