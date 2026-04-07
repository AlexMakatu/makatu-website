import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

type RelatedPost = {
  title: string;
  slug: { current: string };
  mainImage?: {
    asset?: {
      _ref?: string;
    };
  };
  publishedAt?: string;
};

type Props = {
  posts: RelatedPost[];
};

export default function RelatedPosts({ posts }: Props) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-20 pt-12 border-t border-gray-200">
      <h2 className="text-2xl md:text-3xl font-semibold mb-8">
        Related Insights
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {posts.map((item) => (
          <Link
            key={item.slug.current}
            href={`/blog/${item.slug.current}`}
            className="group block"
          >
            {item.mainImage?.asset?._ref && (
              <Image
                src={urlFor(item.mainImage).width(600).height(350).url()}
                alt={item.title}
                width={600}
                height={350}
                className="rounded-xl mb-4 object-cover aspect-[16/9]"
              />
            )}

            <h3 className="text-lg font-semibold leading-snug group-hover:underline">
              {item.title}
            </h3>

            {item.publishedAt && (
              <p className="text-sm text-gray-500 mt-2">
                {new Date(item.publishedAt).toLocaleDateString("en-ZA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
