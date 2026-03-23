import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import imageUrlBuilder from "@sanity/image-url";
import { Metadata } from "next";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Link from "next/link";

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

type Author = {
  name: string;
  slug: {
    current: string;
  };
  role?: string;
  image?: SanityImageSource;
};

type Category = {
  title: string;
  slug: {
    current: string;
  };
};

type Post = {
  title: string;
  body: PortableTextBlock[];
  publishedAt?: string;
  mainImage?: SanityImageSource;
  seoTitle?: string;
  seoDescription?: string;
  author?: Author;
  category?: Category;
};

type Params = {
  slug: string;
};

/* -------------------------------- */
/* SEO METADATA */
/* -------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post: Pick<Post, "title" | "seoTitle" | "seoDescription"> =
    await client.fetch(
      groq`*[_type == "blogPost" && slug.current == $slug][0]{
        title,
        seoTitle,
        seoDescription
      }`,
      { slug },
    );

  return {
    title: post?.seoTitle || post?.title || "Makatu Blog",
    description:
      post?.seoDescription ||
      "Vehicle transport and logistics insights across South Africa.",
  };
}

/* -------------------------------- */
/* BLOG ARTICLE PAGE */
/* -------------------------------- */

export default async function BlogPost({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const post: Post = await client.fetch(
    groq`*[_type == "blogPost" && slug.current == $slug][0]{
      title,
      body,
      mainImage,
      publishedAt,
      author->{
        name,
        slug,
        role,
        image
      },
      category->{
        title,
        slug
      }
    }`,
    { slug },
  );

  if (!post) {
    return (
      <main className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-2xl font-semibold">Post not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* CATEGORY */}
        {post.category && (
          <Link
            href={`/blog/category/${post.category.slug.current}`}
            className="text-sm font-semibold text-blue-600 uppercase"
          >
            {post.category.title}
          </Link>
        )}

        {/* TITLE */}
        <h1 className="text-4xl font-bold mt-2 mb-4">{post.title}</h1>

        {/* AUTHOR */}
        {post.author && (
          <div className="flex items-center gap-3 mb-4">
            {post.author.image && (
              <img
                src={urlFor(post.author.image).width(60).height(60).url()}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}

            <div>
              <Link
                href={`/authors/${post.author.slug.current}`}
                className="text-sm font-semibold hover:underline"
              >
                {post.author.name}
              </Link>

              {post.author.role && (
                <p className="text-xs text-gray-500">{post.author.role}</p>
              )}
            </div>
          </div>
        )}

        {/* DATE */}
        {post.publishedAt && (
          <p className="text-sm text-gray-500 mb-6">
            {new Date(post.publishedAt).toLocaleDateString()}
          </p>
        )}

        {/* FEATURED IMAGE */}
        {post.mainImage && (
          <img
            src={urlFor(post.mainImage).width(1200).url()}
            alt={post.title}
            className="rounded-lg mb-10"
          />
        )}

        {/* ARTICLE CONTENT */}
        <article className="prose max-w-none">
          <PortableText value={post.body} />
        </article>
      </div>
    </main>
  );
}
