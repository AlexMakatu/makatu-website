import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import Link from "next/link";
import type { PortableTextBlock } from "@portabletext/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/* ---------------- COMPONENTS ---------------- */

import RelatedPosts from "@/components/blog/RelatedPosts";
import PopularRoutes from "@/components/blog/PopularRoutes";

/* ---------------- IMAGE BUILDER ---------------- */

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/* ---------------- TYPES ---------------- */

type Section = {
  _type: string;
  _key: string;
  title?: string;
  content?: PortableTextBlock[];
  layout?: "imageLeft" | "imageRight";
  image?: {
    asset: SanityImageSource;
    alt?: string;
  };
  caption?: string;
  buttonText?: string;
  buttonLink?: string;
};

type Post = {
  title: string;
  slug: { current: string };
  publishedAt?: string;
  mainImage?: SanityImageSource;
  seoTitle?: string;
  seoDescription?: string;
  sections?: Section[];
  author?: {
    name: string;
    slug?: { current?: string };
    image?: SanityImageSource;
  };
  category?: {
    _id: string;
  };
  relatedCities?: {
    _id: string;
    name: string;
  }[];
};

/* ---------------- SEO ---------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await client.fetch<Post | null>(
    groq`*[_type == "blogPost" && slug.current == $slug][0]{
      title,
      seoTitle,
      seoDescription,
      mainImage
    }`,
    { slug },
  );

  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || "",

    alternates: {
      canonical: `/insights/${slug}`,
    },

    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription,
      images: post.mainImage
        ? [
            {
              url: urlFor(post.mainImage).width(1200).height(630).url(),
            },
          ]
        : [],
    },
  };
}

/* ---------------- PAGE ---------------- */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
        slug,
        image
      },
      category->{
        _id
      },
      relatedCities[]->{
        _id,
        name
      }
    }`,
    { slug },
  );

  if (!post) return notFound();

  /* ---------------- RELATED POSTS ---------------- */

  let relatedPosts = await client.fetch(
    groq`*[_type == "blogPost"
      && slug.current != $slug
      && category->_id == $categoryId
    ]
    | order(publishedAt desc)[0..3]{
      title,
      slug,
      publishedAt,
      mainImage
    }`,
    {
      slug,
      categoryId: post.category?._id ?? null,
    },
  );

  if (relatedPosts.length === 0) {
    relatedPosts = await client.fetch(
      groq`*[_type == "blogPost" && slug.current != $slug]
      | order(publishedAt desc)[0..3]{
        title,
        slug,
        publishedAt,
        mainImage
      }`,
      { slug },
    );
  }

  /* ---------------- ROUTES ---------------- */

  let popularRoutes = [];

  if (post.relatedCities?.length) {
    const cityNames = post.relatedCities.map((c) => c.name);

    popularRoutes = await client.fetch(
      groq`*[_type == "route" &&
        (fromCity->name in $cities || toCity->name in $cities)
      ][0..3]{
        slug,
        fromCity->{ name },
        toCity->{ name }
      }`,
      { cities: cityNames },
    );
  }

  if (!popularRoutes.length) {
    popularRoutes = await client.fetch(
      groq`*[_type == "route" && featuredRoute == true][0..3]{
        slug,
        fromCity->{ name },
        toCity->{ name }
      }`,
    );
  }

  /* ---------------- STRUCTURED DATA ---------------- */

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
        }
      : undefined,
  };

  return (
    <main className="py-20">
      <article className="max-w-6xl mx-auto px-6">
        {/* ✅ STRUCTURED DATA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* BREADCRUMBS */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/">Home</Link> / <Link href="/blog">Insights</Link> /{" "}
          <span className="text-gray-800">{post.title}</span>
        </nav>

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-4xl">
          {post.title}
        </h1>

        {/* INTRO (SEO BOOST) */}
        {post.seoDescription && (
          <p className="text-lg text-gray-600 mb-10 max-w-3xl">
            {post.seoDescription}
          </p>
        )}

        {/* DATE */}
        {post.publishedAt && (
          <p className="text-gray-500 mb-8">
            {new Date(post.publishedAt).toLocaleDateString("en-ZA")}
          </p>
        )}

        {/* IMAGE */}
        {post.mainImage && (
          <Image
            src={urlFor(post.mainImage).width(2000).height(1125).url()}
            alt={post.title}
            width={2000}
            height={1125}
            className="rounded-2xl mb-16 w-full object-cover"
          />
        )}

        {/* CONTENT */}
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

              {post.author.slug?.current ? (
                <Link
                  href={`/authors/${post.author.slug.current}`}
                  className="font-medium hover:underline"
                >
                  {post.author.name}
                </Link>
              ) : (
                <p className="font-medium">{post.author.name}</p>
              )}
            </div>
          </div>
        )}

        {/* RELATED */}
        <RelatedPosts posts={relatedPosts} />

        {/* ROUTES */}
        <PopularRoutes routes={popularRoutes} />
      </article>
    </main>
  );
}
