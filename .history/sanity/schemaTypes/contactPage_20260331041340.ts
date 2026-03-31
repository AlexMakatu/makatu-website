import { defineType, defineField } from "sanity";

export default defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
    }),

    defineField({
      name: "introText",
      title: "Intro Text",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),

    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
    }),

    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      description: "Include country code without + (example: 27821234567)",
      type: "string",
    }),

    defineField({
      name: "address",
      title: "Office Address",
      type: "text",
      rows: 2,
    }),

    defineField({
      name: "serviceAreas",
      title: "Service Areas",
      description: "Cities Makatu services",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "quoteCTA",
      title: "Quote Call To Action Text",
      type: "string",
    }),
    defineField({
  name: "seo",
  title: "SEO & AI Optimization",
  type: "object",
  fields: [
    {
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Max 60 characters",
    },
    {
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 2,
      description: "Max 160 characters",
    },

    // 🔥 KEYWORDS (still useful for internal targeting + AI context)
    {
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
    },

    // 🔥 AI SUMMARY (VERY IMPORTANT)
    {
      name: "aiSummary",
      title: "AI Summary",
      type: "text",
      rows: 3,
      description:
        "Short summary explaining this page clearly for AI tools and search engines",
    },

    // 🔥 CANONICAL
    {
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
    },

    // 🔥 OG (SOCIAL + AI SCRAPING)
    {
      name: "ogTitle",
      title: "OG Title",
      type: "string",
    },
    {
      name: "ogDescription",
      title: "OG Description",
      type: "text",
      rows: 2,
    },
    {
      name: "ogImage",
      title: "OG Image",
      type: "image",
    },

    // 🔥 INDEX CONTROL
    {
      name: "noIndex",
      title: "No Index",
      type: "boolean",
    },

    // 🔥 STRUCTURED DATA TYPE
    {
      name: "schemaType",
      title: "Schema Type",
      type: "string",
      options: {
        list: [
          { title: "WebPage", value: "WebPage" },
          { title: "FAQPage", value: "FAQPage" },
          { title: "Service", value: "Service" },
        ],
      },
    },
  ],
});
  ],
});
