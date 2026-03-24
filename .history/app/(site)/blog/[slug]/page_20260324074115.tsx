import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import Link from "next/link";
import type { PortableTextBlock } from "@portabletext/types";

// ✅ COMPONENTS
import RelatedPosts from "@/components/blog/RelatedPosts";
import PopularRoutes from "@/components/blog/PopularRoutes";

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
}) {
  const { slug } = await params;

  const post = await client.fetch<Post | null>(
    groq`*[_type == "blogPost" && slug.current == $slug][0]{
      title,
      seoTitle,
      seoDescription
    }`,
    { slug },
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

  /* ---------------- RELATED POSTS (CATEGORY-BASED) ---------------- */

  let relatedPosts = await client.fetch<
    {
      title: string;
      slug: { current: string };
      mainImage?: SanityImageSource;
      publishedAt?: string;
    }[]
  >(
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
      slug: params.slug,
      categoryId: post.category?._id,
    },
  );

  /* 🔁 FALLBACK → LATEST POSTS */
  if (relatedPosts.length === 0) {
    relatedPosts = await client.fetch<
      {
        title: string;
        slug: { current: string };
        mainImage?: SanityImageSource;
        publishedAt?: string;
      }[]
    >(
      groq`*[_type == "blogPost" && slug.current != $slug]
        | order(publishedAt desc)[0..3]{
          title,
          slug,
          publishedAt,
          mainImage
        }`,
      { slug: params.slug },
    );
  }

  /* ---------------- SMART ROUTES ---------------- */

  let popularRoutes: {
    slug?: { current?: string };
    fromCity?: { name?: string };
    toCity?: { name?: string };
  }[] = [];

  if (post.relatedCities && post.relatedCities.length > 0) {
    const cityNames = post.relatedCities.map((c) => c.name);

    popularRoutes = await client.fetch(
      groq`*[_type == "route" &&
        (
          fromCity->name in $cities ||
          toCity->name in $cities
        )
      ][0..3]{
        slug,
        fromCity->{ name },
        toCity->{ name }
      }`,
      { cities: cityNames },
    );
  }

  /* 🔁 FALLBACK → FEATURED ROUTES */
  if (!popularRoutes || popularRoutes.length === 0) {
    popularRoutes = await client.fetch(
      groq`*[_type == "route" && featuredRoute == true][0..3]{
        slug,
        fromCity->{ name },
        toCity->{ name }
      }`,
    );
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

        {/* ---------------- RELATED POSTS ---------------- */}
        <RelatedPosts posts={relatedPosts} />

        {/* ---------------- SMART ROUTES ---------------- */}
        <PopularRoutes routes={popularRoutes} />
      </article>
    </main>
  );
}
