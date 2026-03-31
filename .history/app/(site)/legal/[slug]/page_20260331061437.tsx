import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { PortableTextBlock } from "sanity";
import type { Metadata } from "next";

/* --------------------------
TYPES
--------------------------- */

type LegalPage = {
  title: string;
  content: PortableTextBlock[];
  lastUpdated?: string;
  slug?: string;

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogImage?: {
      asset?: { url?: string };
    };
  };
};

/* --------------------------
QUERY
--------------------------- */

const query = groq`
*[_type == "legalPage" && slug.current == $slug][0]{
  title,
  content,
  lastUpdated,
  "slug": slug.current,

  seo {
    metaTitle,
    metaDescription,
    canonicalUrl,
    ogTitle,
    ogImage{
      asset->{url}
    }
  }
}
`;

/* --------------------------
SEO (DYNAMIC)
--------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const page: LegalPage = await client.fetch(query, { slug });

  if (!page) {
    return {
      title: "Page not found",
    };
  }

  return {
    title: page?.seo?.metaTitle || `${page.title} | Makatu`,

    description:
      page?.seo?.metaDescription ||
      "Legal information and policies for Makatu vehicle transport services.",

    alternates: {
      canonical: page?.seo?.canonicalUrl || `/legal/${page.slug}`,
    },

    openGraph: {
      title: page?.seo?.ogTitle || page?.seo?.metaTitle || page.title,

      description: page?.seo?.metaDescription,

      images: page?.seo?.ogImage?.asset?.url
        ? [{ url: page.seo.ogImage.asset.url }]
        : [],
    },
  };
}

/* --------------------------
PORTABLE TEXT COMPONENTS
--------------------------- */

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="text-gray-700">{children}</li>,
  },
};

/* --------------------------
PAGE
--------------------------- */

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegalPage({ params }: PageProps) {
  const { slug } = await params;

  const page: LegalPage = await client.fetch(query, { slug });

  if (!page) {
    return <div className="p-10">Page not found</div>;
  }

  /* 🔥 STRUCTURED DATA */
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page?.seo?.metaDescription,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ✅ STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {page.title}
          </h1>

          {page.lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {page.lastUpdated}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
          <PortableText value={page.content} components={components} />
        </div>
      </div>
    </div>
  );
}
