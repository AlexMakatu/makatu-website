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
      // 🔗 BROKEN INTERNAL LINKS (Screaming Frog 4xx, Oct 2026)
      {
        source: "/vehicle-transport/johannesburg-to-cape-town",
        destination: "/vehicle-transport/johannesburg-to-cape-town-vehicle-transport",
        permanent: true,
      },
      {
        source: "/vehicle-transport/pretoria-to-durban",
        destination: "/vehicle-transport/pretoria-to-durban-vehicle-transport",
        permanent: true,
      },
      {
        source: "/is-car-transport-safe-in-south-africa",
        destination: "/blog/is-car-transport-safe-in-south-africa-what-you-need-to-know",
        permanent: true,
      },
      {
        source: "/blog/how-to-prepare-your-car-for-transport-in-south-africa",
        destination: "/blog/how-to-prepare-your-car-for-transport-south-africa",
        permanent: true,
      },
      {
        source: "/vehicle-transport/cape-town-to-durban-vehicle-transport",
        destination: "/vehicle-transport/routes",
        permanent: true,
      },
      {
        source: "/vehicle-transport/cape-town-to-durban",
        destination: "/vehicle-transport/routes",
        permanent: true,
      },

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
