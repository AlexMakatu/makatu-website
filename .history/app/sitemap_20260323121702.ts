// app/sitemap.ts
import type { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

type SlugItem = {
  slug?: {
    current?: string;
  };
  _updatedAt?: string;
};

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.makatu.co.za";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/vehicle-transport`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/get-a-quote`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quote-success`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const [routes, blogPosts, categories, authors] = await Promise.all([
    client.fetch<SlugItem[]>(
      groq`*[_type == "route" && defined(slug.current)]{
        slug,
        _updatedAt
      }`,
      {},
      { cache: "no-store" },
    ),
    client.fetch<SlugItem[]>(
      groq`*[_type == "blogPost" && defined(slug.current)]{
        slug,
        _updatedAt
      }`,
      {},
      { cache: "no-store" },
    ),
    client.fetch<SlugItem[]>(
      groq`*[_type == "category" && defined(slug.current)]{
        slug,
        _updatedAt
      }`,
      {},
      { cache: "no-store" },
    ),
    client.fetch<SlugItem[]>(
      groq`*[_type == "author" && defined(slug.current)]{
        slug,
        _updatedAt
      }`,
      {},
      { cache: "no-store" },
    ),
  ]);

  const routePages: MetadataRoute.Sitemap = routes
    .filter((item) => item.slug?.current)
    .map((item) => ({
      url: `${baseUrl}/vehicle-transport/${item.slug?.current ?? ""}`,
      lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const blogPages: MetadataRoute.Sitemap = blogPosts
    .filter((item) => item.slug?.current)
    .map((item) => ({
      url: `${baseUrl}/blog/${item.slug?.current ?? ""}`,
      lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((item) => item.slug?.current)
    .map((item) => ({
      url: `${baseUrl}/blog/category/${item.slug?.current ?? ""}`,
      lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  const authorPages: MetadataRoute.Sitemap = authors
    .filter((item) => item.slug?.current)
    .map((item) => ({
      url: `${baseUrl}/authors/${item.slug?.current ?? ""}`,
      lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [
    ...staticPages,
    ...routePages,
    ...blogPages,
    ...categoryPages,
    ...authorPages,
  ];
}
