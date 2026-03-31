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
        source: "/privacyolicy.html",
        destination: "/legal/privacy-policy",
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

      // 📝 BLOG (TEMP CATCH-ALL)
      {
        source: "/vehicle-transport-blog:slug(.html)?",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
