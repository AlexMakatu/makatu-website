import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
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
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>

      {/* Last updated */}
      {page.lastUpdated && (
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {page.lastUpdated}
        </p>
      )}

      {/* Content */}
      <div className="prose max-w-none">
        <PortableText value={page.content} />
      </div>
    </div>
  );
}
