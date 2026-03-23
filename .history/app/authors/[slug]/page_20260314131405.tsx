import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

type Author = {
  name: string;
  slug: {
    current: string;
  };
  role?: string;
  image?: SanityImageSource;
};

export default async function AuthorsPage() {
  const authors: Author[] = await client.fetch(
    groq`*[_type == "author"]{
      name,
      slug,
      role,
      image
    }`,
  );

  return (
    <main className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10">Authors</h1>

        <div className="space-y-8">
          {authors.map((author) => (
            <Link
              key={author.slug.current}
              href={`/authors/${author.slug.current}`}
              className="flex items-center gap-4 hover:underline"
            >
              {author.image && (
                <img
                  src={urlFor(author.image).width(80).height(80).url()}
                  alt={author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}

              <div>
                <p className="font-semibold">{author.name}</p>

                {author.role && (
                  <p className="text-sm text-gray-500">{author.role}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
