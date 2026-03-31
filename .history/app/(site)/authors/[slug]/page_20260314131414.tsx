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
  role?: string;
  bio?: string;
  image?: SanityImageSource;
};

type Post = {
  title: string;
  slug: {
    current: string;
  };
};

type Params = {
  slug: string;
};

export default async function AuthorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const author: Author = await client.fetch(
    groq`*[_type == "author" && slug.current == $slug][0]{
      name,
      role,
      bio,
      image
    }`,
    { slug },
  );

  const posts: Post[] = await client.fetch(
    groq`*[_type == "blogPost" && author->slug.current == $slug]{
      title,
      slug
    }`,
    { slug },
  );

  if (!author) {
    return <div>Author not found</div>;
  }

  return (
    <main className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          {author.image && (
            <img
              src={urlFor(author.image).width(100).height(100).url()}
              alt={author.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}

          <div>
            <h1 className="text-3xl font-bold">{author.name}</h1>

            {author.role && <p className="text-gray-500">{author.role}</p>}
          </div>
        </div>

        {author.bio && <p className="mb-10 text-gray-700">{author.bio}</p>}

        <h2 className="text-2xl font-semibold mb-6">
          Articles by {author.name}
        </h2>

        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug.current}
              href={`/blog/${post.slug.current}`}
              className="block hover:underline"
            >
              {post.title}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
