import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
export const dynamic = "force-dynamic";
const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

type Slug = {
  current: string;
};

type Author = {
  name: string;
  slug: Slug;
  image?: SanityImageSource;
};

type Category = {
  title: string;
  slug: Slug;
};

type Post = {
  title: string;
  slug: Slug;
  excerpt?: string;
  publishedAt?: string;
  mainImage?: SanityImageSource;
  author?: Author;
  category?: Category;
};

export default async function BlogPage() {
  const posts: Post[] = await client.fetch(
    groq`*[_type == "blogPost" && defined(slug.current)] 
  | order(coalesce(publishedAt, _createdAt) desc){
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage,
      author->{
        name,
        slug,
        image
      },
      category->{
        title,
        slug
      }
    }`,
  );

  return (
    <main className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-12">Blog</h1>

        {posts.length === 0 && (
          <p className="text-gray-500">No articles yet.</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <article
              key={post.slug.current}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {post.mainImage?.asset?._ref && (
                <Image
                  src={urlFor(post.mainImage).width(800).height(500).url()}
                  alt={post.title}
                  width={800}
                  height={500}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-6">
                {post.category && (
                  <Link
                    href={`/blog/category/${post.category.slug.current}`}
                    className="text-xs font-semibold text-blue-600 uppercase"
                  >
                    {post.category.title}
                  </Link>
                )}

                <Link
                  href={`/blog/${post.slug.current}`}
                  className="block text-xl font-semibold hover:underline mt-2"
                >
                  {post.title}
                </Link>

                {post.author && (
                  <div className="flex items-center gap-2 mt-3">
                    {post.author.image && (
                      <Image
                        src={urlFor(post.author.image)
                          .width(40)
                          .height(40)
                          .url()}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}

                    <Link
                      href={`/authors/${post.author.slug.current}`}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      {post.author.name}
                    </Link>
                  </div>
                )}

                {post.publishedAt && (
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(post.publishedAt).toLocaleDateString("en-ZA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}

                {post.excerpt && (
                  <p className="text-gray-600 mt-4">{post.excerpt}</p>
                )}

                <Link
                  href={`/blog/${post.slug.current}`}
                  className="inline-block mt-6 text-blue-600 font-semibold"
                >
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
