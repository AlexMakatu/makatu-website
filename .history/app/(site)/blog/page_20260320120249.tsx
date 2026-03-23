import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

import type { PortableTextComponents } from "@portabletext/react";

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: { asset: SanityImageSource } }) => (
      <Image
        src={urlFor(value.asset).width(800).height(500).url()}
        alt=""
        width={800}
        height={500}
        className="rounded-lg my-8"
      />
    ),
  },
  block: {
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-2xl font-bold mt-10 mb-4">{children}</h2>
    ),
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
  },
};

type Post = {
  title: string;
  content: PortableTextBlock[];
  publishedAt?: string;
  mainImage?: SanityImageSource;
  author?: {
    name: string;
    image?: SanityImageSource;
  };
};

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await client.fetch<Post | null>(
    groq`*[_type == "blogPost" && slug.current == $slug][0]{
      title,
      content,
      publishedAt,
      mainImage,
      author->{
        name,
        image
      }
    }`,
    { slug: params.slug },
  );

  if (!post) {
    return <div className="p-10">Post not found</div>;
  }

  return (
    <main className="py-20">
      <article className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

        {post.publishedAt && (
          <p className="text-gray-500 mb-6">
            {new Date(post.publishedAt).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}

        {post.mainImage && (
          <Image
            src={urlFor(post.mainImage).width(1200).height(700).url()}
            alt={post.title}
            width={1200}
            height={700}
            className="rounded-xl mb-10"
          />
        )}

        <PortableText
          value={post.content}
          components={portableTextComponents}
        />

        {post.author && (
          <div className="mt-16 pt-10 border-t">
            <p className="text-sm text-gray-500">Written by</p>
            <div className="flex items-center gap-3 mt-2">
              {post.author.image && (
                <Image
                  src={urlFor(post.author.image).width(60).height(60).url()}
                  alt={post.author.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              )}
              <p className="font-medium">{post.author.name}</p>
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
