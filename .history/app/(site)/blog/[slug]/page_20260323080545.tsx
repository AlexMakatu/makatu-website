import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { PortableTextBlock } from "@portabletext/types";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/* ---------------- TYPES ---------------- */

type ImageWithAlt = {
  asset: SanityImageSource;
  alt?: string;
};

type TextSection = {
  _type: "textSection";
  _key: string;
  title?: string;
  content?: PortableTextBlock[];
};

type ImageSection = {
  _type: "imageSection";
  _key: string;
  image?: ImageWithAlt;
  caption?: string;
};

type ImageTextSection = {
  _type: "imageTextSection";
  _key: string;
  layout: "imageLeft" | "imageRight";
  content: PortableTextBlock[];
  image: ImageWithAlt;
};

type CTASection = {
  _type: "ctaSection";
  _key: string;
  title?: string;
  content?: PortableTextBlock[];
  buttonText?: string;
  buttonLink?: string;
};

type Section = TextSection | ImageSection | ImageTextSection | CTASection;

type Post = {
  title: string;
  publishedAt?: string;
  mainImage?: SanityImageSource;
  author?: {
    name: string;
    image?: SanityImageSource;
  };
  sections?: Section[];
};

/* ---------------- PORTABLE TEXT ---------------- */

/* ---------------- PAGE ---------------- */

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await client.fetch<Post | null>(
    groq`*[_type == "blogPost" && slug.current == $slug][0]{
      title,
      publishedAt,
      mainImage,
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
      <article className="max-w-5xl mx-auto px-6">
        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

        {/* DATE */}
        {post.publishedAt && (
          <p className="text-gray-500 mb-6">
            {new Date(post.publishedAt).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}

        {/* HERO IMAGE */}
        {post.mainImage && (
          <Image
            src={urlFor(post.mainImage).width(1200).height(700).url()}
            alt={post.title}
            width={1200}
            height={700}
            className="rounded-xl mb-12 w-full"
          />
        )}

        <SectionRenderer sections={post.sections || []} />

        {/* AUTHOR */}
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
