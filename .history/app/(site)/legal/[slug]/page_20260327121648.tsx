import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { PortableTextBlock } from "sanity";

type LegalPage = {
  title: string;
  content: PortableTextBlock[];
  lastUpdated?: string;
};

const query = groq`
*[_type == "legalPage" && slug.current == $slug][0]{
  title,
  content,
  lastUpdated
}
`;

// ✅ Custom PortableText components (THIS FIXES YOUR ISSUE)
const components = {
  block: {
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
    ),
  },

  list: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>
    ),
  },

  listItem: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <li className="text-gray-700">{children}</li>
    ),
  },
};

export default async function LegalPage({
  params,
}: {
  params: { slug: string };
}) {
  const page: LegalPage = await client.fetch(query, {
    slug: params.slug,
  });

  if (!page) {
    return <div className="p-10">Page not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
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
