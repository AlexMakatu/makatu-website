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
  image?: SanityImageSource;
};

type Post = {
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  publishedAt?: string;
  mainImage?: SanityImageSource;
  author?: Author;
};

export default async function BlogPage() {
  const posts: Post[] = await client.fetch(
    groq`*[_type == "blogPost"] | order(publishedAt desc){
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage,
      author->{
        name,
        image
      }
    }`,
  );

  return (
    <main className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-12">Blog</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <article
              key={post.slug.current}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* IMAGE */}
              {post.mainImage && (
                <img
                  src={urlFor(post.mainImage).width(800).height(500).url()}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-6">
                {/* TITLE */}
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="text-xl font-semibold hover:underline"
                >
                  {post.title}
                </Link>

                {/* AUTHOR */}
                {post.author && (
                  <div className="flex items-center gap-2 mt-2">
                    {post.author.image && (
                      <img
                        src={urlFor(post.author.image)
                          .width(40)
                          .height(40)
                          .url()}
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}

                    <span className="text-sm text-gray-500">
                      {post.author.name}
                    </span>
                  </div>
                )}

                {/* DATE */}
                {post.publishedAt && (
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                )}

                {/* EXCERPT */}
                {post.excerpt && (
                  <p className="text-gray-600 mt-4">{post.excerpt}</p>
                )}

                {/* READ MORE */}
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
