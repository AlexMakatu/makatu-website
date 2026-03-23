import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
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
      "Learn more about vehicle transport and logistics in South Africa.",
  };
}

type Post = {
  title: string;
  body: PortableTextBlock[];
  publishedAt?: string;
};

type Params = {
  slug: string;
};

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
      publishedAt
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
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {post.publishedAt && (
          <p className="text-sm text-gray-500 mb-8">
            {new Date(post.publishedAt).toLocaleDateString()}
          </p>
        )}

        <article className="prose max-w-none">
          <PortableText value={post.body} />
        </article>
      </div>
    </main>
  );
}
