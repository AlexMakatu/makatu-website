import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import Link from "next/link";

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/* ---------------- TYPES ---------------- */

type Post = {
  title: string;
  slug: { current: string };
  publishedAt?: string;
  mainImage?: SanityImageSource;
  seoTitle?: string;
  seoDescription?: string;
  sections?: unknown[];
  author?: {
    name: string;
    image?: SanityImageSource;
  };
};

/* ---------------- SEO ---------------- */

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await client.fetch<Post | null>(
    groq`*[_type == "blogPost" && slug.current == $slug][0]{
      title,
      seoTitle,
      seoDescription
    }`,
    { slug: params.slug },
  );

  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || "",
  };
}

/* ---------------- PAGE ---------------- */

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await client.fetch<Post | null>(
    groq`*[_type == "blogPost" && slug.current == $slug][0]{
      title,
      slug,
      publishedAt,
      mainImage,
      seoTitle,
      seoDescription,
      sections[]{
        _type,
        _key,
        title,
        layout,
        content,
        caption,
        buttonText,
        buttonLink,
        image{
          asset,
          alt
        }
      },
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
      <article className="max-w-6xl mx-auto px-6">
        {/* ---------------- BREADCRUMBS ---------------- */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/insights" className="hover:underline">
            Insights
          </Link>{" "}
          / <span className="text-gray-800">{post.title}</span>
        </nav>

        {/* ---------------- TITLE ---------------- */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight max-w-4xl">
          {post.title}
        </h1>

        {/* ---------------- DATE ---------------- */}
        {post.publishedAt && (
          <p className="text-gray-500 mb-8">
            {new Date(post.publishedAt).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {/* ---------------- HERO IMAGE ---------------- */}
        {post.mainImage && (
          <Image
            src={urlFor(post.mainImage).width(2000).height(1125).url()}
            alt={post.title}
            width={2000}
            height={1125}
            className="rounded-2xl mb-16 w-full object-cover aspect-[16/9] shadow-lg"
          />
        )}

        {/* ---------------- SECTIONS ---------------- */}
        <SectionRenderer sections={post.sections || []} />

        {/* ---------------- AUTHOR ---------------- */}
        {post.author && (
          <div className="mt-16 pt-10 border-t border-gray-200">
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
