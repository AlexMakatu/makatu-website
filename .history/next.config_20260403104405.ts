import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },

  import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },

  async redirects() {
    return [
      // 🔐 LEGAL PAGES
      {
        source: "/tcs.html",
        destination: "/legal/terms-and-conditions",
        permanent: true,
      },
      {
        source: "/privacypolicy.html",
        destination: "/legal/privacy-policy",
        permanent: true,
      },
      {
        source: "/claimsprocedure",
        destination: "/legal/claims-procedure",
        permanent: true,
      },
      {
        source: "/claimsprocedure/",
        destination: "/legal/claims-procedure",
        permanent: true,
      },

      // 🧱 CORE
      {
        source: "/about.html",
        destination: "/vehicle-transport",
        permanent: true,
      },
      {
        source: "/Blog.html",
        destination: "/blog",
        permanent: true,
      },

      // 📝 BLOG (handle both cases explicitly)
      {
        source: "/vehicle-transport-blog:slug",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/vehicle-transport-blog:slug.html",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;