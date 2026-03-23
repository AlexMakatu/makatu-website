import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";

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
    groq`*[_type == "blogPost" && category->slug.current == $slug]{
      title,
      slug
    }`,
    { slug },
  );

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <main className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* CATEGORY HEADER */}
        <h1 className="text-4xl font-bold mb-4">{category.title}</h1>

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
      </div>
    </main>
  );
}
