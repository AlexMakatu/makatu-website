import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import imageUrlBuilder from "@sanity/image-url";
import { Metadata } from "next";

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

type Post = {
  title: string;
  body: PortableTextBlock[];
  publishedAt?: string;
  mainImage?: any;
  seoTitle?: string;
  seoDescription?: string;
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

  const post = await client.fetch(
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
      publishedAt,
      mainImage,
      seoTitle,
      seoDescription
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
        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

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
