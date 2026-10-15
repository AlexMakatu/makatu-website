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

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
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
        destination: "/business-profile",
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
        destination: "/business-profile",
        permanent: true,
      },
      {
        source: "/Makatu Management.html",
        destination: "/business-profile",
        permanent: true,
      },
      {
        source: "/Contact Us.html",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/Makatu%20Current.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/Makatu Current.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/vehicle-transport.html",
        destination: "/vehicle-transport",
        permanent: true,
      },
      {
        // vehicle-transport-blog1.html ... blog7.html (old static blog posts)
        source: "/vehicle-transport-blog:num(\\d+).html",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/index.html",
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
