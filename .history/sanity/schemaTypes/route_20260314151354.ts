import { defineType, defineField } from "sanity";

export default defineType({
  name: "route",
  title: "Vehicle Transport Route",
  type: "document",

  groups: [
    { name: "content", title: "Content" },
    { name: "details", title: "Route Details" },
    { name: "seo", title: "SEO" },
    { name: "links", title: "Internal Links" },
  ],

  fields: [
    defineField({
      name: "title",
      title: "Route Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
      description: "Example: Johannesburg to Durban Vehicle Transport",
    }),

    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "fromCity",
      title: "From City",
      type: "reference",
      to: [{ type: "city" }],
      group: "details",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "toCity",
      title: "To City",
      type: "reference",
      to: [{ type: "city" }],
      group: "details",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "routeImage",
      title: "Route Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
    }),

    defineField({
      name: "heroText",
      title: "Hero Description",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short description shown under the hero heading",
    }),

    defineField({
      name: "transitTime",
      title: "Typical Transit Time (Days)",
      type: "number",
      group: "details",
      description: "Example: 1 or 2 days",
    }),

    defineField({
      name: "introduction",
      title: "Route Introduction",
      type: "text",
      rows: 4,
      group: "content",
      description: "Intro paragraph explaining the route",
    }),

    defineField({
      name: "benefits",
      title: "Why Choose Makatu",
      type: "array",
      group: "content",
      of: [
        {
          name: "benefitItem",
          title: "Benefit",
          type: "object",
          fields: [
            {
              name: "title",
              title: "Benefit Text",
              type: "string",
            },
            {
              name: "icon",
              title: "Icon",
              type: "image",
              options: { hotspot: true },
            },
          ],
        },
      ],
    }),

    defineField({
      name: "seoContent",
      title: "SEO Content",
      type: "text",
      rows: 6,
      group: "seo",
      description: "Long-form SEO content for this route",
    }),

    defineField({
      name: "featuredRoute",
      title: "Featured Route",
      type: "boolean",
      initialValue: false,
      group: "content",
      description: "Show this route on the homepage",
    }),

    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "links",
      of: [
        {
          type: "reference",
          to: [{ type: "faq" }],
        },
      ],
    }),

    defineField({
      name: "relatedRoutes",
      title: "Related Routes",
      type: "array",
      group: "links",
      of: [
        {
          type: "reference",
          to: [{ type: "route" }],
        },
      ],
    }),

    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
    }),

    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
    }),
  ],

  preview: {
    select: {
      title: "title",
      fromCity: "fromCity.name",
      toCity: "toCity.name",
      media: "routeImage",
    },
    prepare({ title, fromCity, toCity, media }) {
      return {
        title,
        subtitle: `${fromCity || ""} → ${toCity || ""}`,
        media,
      };
    },
  },
});
