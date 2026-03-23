import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";

type Author = {
  name: string;
  slug: {
    current: string;
  };
  role?: string;
};

export default async function AuthorsPage() {
  const authors: Author[] = await client.fetch(
    groq`*[_type == "author"]{
      name,
      slug,
      role
    }`,
  );

  return (
    <main className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10">Authors</h1>

        <div className="space-y-6">
          {authors.map((author) => (
            <Link
              key={author.slug.current}
              href={`/authors/${author.slug.current}`}
              className="block text-xl font-semibold hover:underline"
            >
              {author.name}
              {author.role && (
                <span className="text-gray-500 ml-2">— {author.role}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
