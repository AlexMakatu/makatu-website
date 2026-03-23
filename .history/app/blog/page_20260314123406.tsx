import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";

type Post = {
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  publishedAt?: string;
};

export default async function BlogPage() {
  const posts: Post[] = await client.fetch(
    groq`*[_type == "blogPost"] | order(publishedAt desc){
      title,
      slug,
      excerpt,
      publishedAt
    }`,
  );

  return (
    <main className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10">Blog</h1>

        <div className="space-y-10">
          {posts.map((post) => (
            <article key={post.slug.current}>
              <Link
                href={`/blog/${post.slug.current}`}
                className="text-2xl font-semibold hover:underline"
              >
                {post.title}
              </Link>

              {post.publishedAt && (
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              )}

              {post.excerpt && (
                <p className="text-gray-600 mt-3">{post.excerpt}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
