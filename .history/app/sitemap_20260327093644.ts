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

export const revalidate = 60; // 🔥 auto-refresh sitemap every 60s

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  /* ================= STATIC ================= */

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/get-a-quote`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/vehicle-transport`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  /* ================= FETCH ================= */

  const [routes, blogPosts, categories, authors, cities] = await Promise.all([
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
    client.fetch<SlugItem[]>(
      groq`*[_type == "city" && defined(slug.current)]{
        slug,
        _updatedAt
      }`,
      {},
      { cache: "no-store" },
    ),
  ]);

  /* ================= ROUTES ================= */

  const routePages: MetadataRoute.Sitemap = routes
    .filter((item) => item.slug?.current)
    .map((item) => ({
      url: `${baseUrl}/vehicle-transport/${item.slug!.current!}`,
      lastModified: item._updatedAt ? new Date(item._updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

  /* ================= BLOG ================= */

  const blogPages: MetadataRoute.Sitemap = blogPosts
    .filter((item) => item.slug?.current)
    .map((item) => ({
      url: `${baseUrl}/blog/${item.slug!.current!}`,
      lastModified: item._updatedAt ? new Date(item._updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((item) => item.slug?.current)
    .map((item) => ({
      url: `${baseUrl}/blog/category/${item.slug!.current!}`,
      lastModified: item._updatedAt ? new Date(item._updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const authorPages: MetadataRoute.Sitemap = authors
    .filter((item) => item.slug?.current)
    .map((item) => ({
      url: `${baseUrl}/authors/${item.slug!.current!}`,
      lastModified: item._updatedAt ? new Date(item._updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }));

  /* ================= CITIES (NEW) ================= */

  const cityPages: MetadataRoute.Sitemap = cities
    .filter((item) => item.slug?.current)
    .map((item) => ({
      url: `${baseUrl}/vehicle-transport/city/${item.slug!.current!}`,
      lastModified: item._updatedAt ? new Date(item._updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  /* ================= RETURN ================= */

  return [
    ...staticPages,
    ...routePages,
    ...blogPages,
    ...categoryPages,
    ...authorPages,
    ...cityPages, // ✅ NEW
  ];
}
