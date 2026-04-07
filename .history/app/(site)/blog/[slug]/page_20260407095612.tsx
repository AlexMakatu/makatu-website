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
  mainImage?: {
    asset?: {
      asset?: {
        _ref?: string;
      };
    };
    alt?: string;
  };
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
      canonical: `/blog/${slug}`,
    },

    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription,
      images: post.mainImage
        ? [
            {
              url: post.mainImage?.asset?.asset?._ref
                ? urlFor(post.mainImage.asset.asset)
                    .width(1200)
                    .height(630)
                    .url()
                : "",
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
    text,
    heading,
    layout,
    content,
    caption,
    buttonText,
    buttonLink,
    sectionKey,
    questions[]{
      question,
      answer
    },
    image{
      asset,
      alt
    }
  },  // 👈 THIS COMMA WAS MISSING
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
  console.log("BLOG POST DATA:", JSON.stringify(post, null, 2));
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
  const faqSection = post.sections?.find((s) => s._type === "faqSection") as
    | { questions?: { question: string; answer: string }[] }
    | undefined;

  const faqJsonLd =
    faqSection?.questions && faqSection.questions.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqSection.questions.map((q) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: q.answer,
            },
          })),
        }
      : null;
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
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqJsonLd),
            }}
          />
        )}

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
        {/* 🔥 QUICK CONVERSION BOX */}
        <div className="bg-gray-100 border rounded-2xl p-6 mb-12 max-w-3xl">
          <h3 className="text-xl font-semibold mb-4">
            Quick Transport Estimate
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Typical Price</p>
              <p className="font-medium">R3,500 – R12,000</p>
            </div>

            <div>
              <p className="text-gray-500">Delivery Time</p>
              <p className="font-medium">1–5 Days</p>
            </div>

            <div>
              <p className="text-gray-500">Coverage</p>
              <p className="font-medium">Nationwide</p>
            </div>
          </div>

          <Link
            href="/get-a-quote"
            className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            Get a Quote
          </Link>
        </div>
        {/* ✅ TRUST STRIP */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-12">
          <span>✔ Fully insured transport</span>
          <span>✔ Nationwide delivery</span>
          <span>✔ Trusted by SA customers</span>
        </div>
        {/* DATE */}
        {post.publishedAt && (
          <p className="text-gray-500 mb-8">
            {new Date(post.publishedAt).toLocaleDateString("en-ZA")}
          </p>
        )}

        {/* IMAGE */}
        {post.mainImage?.asset?.asset?._ref && (
          <Image
            src={urlFor(post.mainImage.asset.asset)
              .width(2000)
              .height(1125)
              .url()}
            alt={post.mainImage?.alt || post.title}
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
      {/* 🔥 STICKY CTA */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <Link
          href="/get-a-quote"
          className="bg-black text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium hover:opacity-90"
        >
          Get a Quote
        </Link>
      </div>
    </main>
  );
}
