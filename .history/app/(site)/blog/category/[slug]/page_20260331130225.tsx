import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import Script from "next/script";

type Post = {
  title: string;
  slug: {
    current: string;
  };
};

type Category = {
  title: string;
  description?: string;
};

type Params = {
  slug: string;
};

/* ================= METADATA ================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const category: Category = await client.fetch(
    groq`*[_type == "category" && slug.current == $slug][0]{
      title,
      description
    }`,
    { slug },
  );

  if (!category) {
    return {
      title: "Category Not Found | Makatu",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${category.title} | Vehicle Transport Blog | Makatu`;

  const description =
    category.description ||
    `Explore ${category.title.toLowerCase()} insights, tips, and guides for vehicle transport in South Africa.`;

  return {
    title,
    description,
    keywords: [
      `${category.title} vehicle transport`,
      `${category.title} car shipping`,
      "vehicle transport South Africa",
      "car transport blog South Africa",
    ],
    alternates: {
      canonical: `https://www.makatu.co.za/blog/category/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://makatu.co.za/blog/category/${slug}`,
      type: "website",
      siteName: "Makatu",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ================= PAGE ================= */

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const category: Category = await client.fetch(
    groq`*[_type == "category" && slug.current == $slug][0]{
      title,
      description
    }`,
    { slug },
  );

  const posts: Post[] = await client.fetch(
    groq`*[_type == "blogPost" && category->slug.current == $slug] | order(_createdAt desc){
      title,
      slug
    }`,
    { slug },
  );

  if (!category) {
    return <div className="text-center py-20">Category not found</div>;
  }

  /* ================= SCHEMA ================= */

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Blog",
        item: "https://makatu.co.za/blog",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.title,
        item: `https://makatu.co.za/blog/category/${slug}`,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.description,
    url: `https://makatu.co.za/blog/category/${slug}`,
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: `https://makatu.co.za/blog/${post.slug.current}`,
    })),
  };

  return (
    <main className="py-20">
      {/* ================= SEO SCHEMA ================= */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <Script
        id="collection-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd),
        }}
      />

      <Script
        id="itemlist-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd),
        }}
      />

      <div className="max-w-3xl mx-auto px-6">
        {/* CATEGORY HEADER */}
        <h1 className="text-4xl font-bold mb-4">
          {category.title} Vehicle Transport Guides
        </h1>

        {category.description && (
          <p className="text-gray-600 mb-10">{category.description}</p>
        )}

        {/* POSTS */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug.current}
              href={`/blog/${post.slug.current}`}
              className="block text-lg hover:underline"
            >
              {post.title}
            </Link>
          ))}
        </div>

        {/* SEO CONTENT BOOST */}
        <div className="mt-16 text-sm text-gray-500 leading-relaxed">
          <p>
            Discover expert advice on vehicle transport across South Africa.
            Whether you&apos;re shipping a car from Johannesburg to Cape Town,
            arranging vehicle delivery to Durban, or comparing nationwide
            transport options, our guides cover everything you need to know.
          </p>
        </div>
      </div>
    </main>
  );
}
