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
      // 🔐 LEGAL
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
      {
        source: "/claimsprocedure.html",
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
      {
        source: "/Blog.html/",
        destination: "/blog",
        permanent: true,
      },

      // ⚠️ ENCODED URLS
      {
        source: "/Contact%20Us.html",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/Makatu%20Management.html",
        destination: "/",
        permanent: true,
      },

      // 📝 BLOG OLD STRUCTURE
      {
        source: "/vehicle-transport-blog/:slug",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/vehicle-transport-blog/:slug.html",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
