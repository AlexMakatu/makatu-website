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
      validation: (Rule) => Rule.required(),
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

    // 🔥 SEO + AI STRUCTURE
    defineField({
      name: "seo",
      title: "SEO & AI Optimization",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          description: "Max 60 characters",
          validation: (Rule) => Rule.max(60),
        }),

        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 2,
          description: "Max 160 characters",
          validation: (Rule) => Rule.max(160),
        }),

        defineField({
          name: "keywords",
          title: "Keywords",
          type: "array",
          of: [{ type: "string" }],
        }),

        defineField({
          name: "aiSummary",
          title: "AI Summary",
          type: "text",
          rows: 3,
          description:
            "Clear summary for AI, voice search, and featured snippets",
        }),

        defineField({
          name: "canonicalUrl",
          title: "Canonical URL",
          type: "url",
        }),

        defineField({
          name: "ogTitle",
          title: "OG Title",
          type: "string",
        }),

        defineField({
          name: "ogDescription",
          title: "OG Description",
          type: "text",
          rows: 2,
        }),

        defineField({
          name: "ogImage",
          title: "OG Image",
          type: "image",
          options: {
            hotspot: true,
          },
        }),

        defineField({
          name: "noIndex",
          title: "No Index",
          type: "boolean",
          initialValue: false,
        }),

        defineField({
          name: "schemaType",
          title: "Schema Type",
          type: "string",
          initialValue: "ContactPage",
          options: {
            list: [
              { title: "WebPage", value: "WebPage" },
              { title: "FAQPage", value: "FAQPage" },
              { title: "Service", value: "Service" },
              { title: "ContactPage", value: "ContactPage" },
            ],
          },
        }),
      ],
    }),
  ],
});
