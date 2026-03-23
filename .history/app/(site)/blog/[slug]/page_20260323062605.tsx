import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { PortableTextComponents } from "@portabletext/react";

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/* ---------------- TYPES ---------------- */

type TextSection = {
  _type: "textSection";
  _key: string;
  title?: string;
  content?: PortableTextBlock[];
};

type ImageSection = {
  _type: "imageSection";
  _key: string;
  image?: SanityImageSource;
  caption?: string;
};

type ImageTextSection = {
  _type: "imageTextSection";
  _key: string;
  title?: string;
  content?: PortableTextBlock[];
  image?: SanityImageSource;
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

/* ---------------- PORTABLE TEXT STYLES ---------------- */

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-8 mb-3">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4">{children}</ul>
    ),
  },
};

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
        content,
        image,
        caption,
        buttonText,
        buttonLink
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
      <article className="max-w-3xl mx-auto px-6">
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
            className="rounded-xl mb-10"
          />
        )}

        {/* SECTIONS */}
        {post.sections?.map((section) => {
          switch (section._type) {
            case "textSection":
              return (
                <div key={section._key} className="mb-8">
                  {section.title && (
                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  )}

                  {section.content && (
                    <PortableText
                      value={section.content}
                      components={portableTextComponents}
                    />
                  )}
                </div>
              );

            case "imageSection":
              return (
                <div key={section._key} className="my-10">
                  {section.image && (
                    <Image
                      src={urlFor(section.image).width(800).url()}
                      alt=""
                      width={800}
                      height={500}
                      className="rounded-lg"
                    />
                  )}

                  {section.caption && (
                    <p className="text-sm text-gray-500 mt-2">
                      {section.caption}
                    </p>
                  )}
                </div>
              );

            case "imageTextSection":
              return (
                <div
                  key={section._key}
                  className="my-12 grid md:grid-cols-2 gap-6"
                >
                  <div>
                    {section.title && (
                      <h2 className="text-2xl font-bold mb-4">
                        {section.title}
                      </h2>
                    )}

                    {section.content && (
                      <PortableText
                        value={section.content}
                        components={portableTextComponents}
                      />
                    )}
                  </div>

                  {section.image && (
                    <Image
                      src={urlFor(section.image).width(600).url()}
                      alt=""
                      width={600}
                      height={400}
                      className="rounded-lg"
                    />
                  )}
                </div>
              );

            case "ctaSection":
              return (
                <div
                  key={section._key}
                  className="my-12 p-8 bg-gray-100 rounded-xl text-center"
                >
                  {section.title && (
                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
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
                      className="inline-block bg-black text-white px-6 py-3 rounded-lg mt-4"
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
