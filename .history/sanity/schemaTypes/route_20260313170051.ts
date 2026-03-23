import { defineType, defineField } from "sanity";

export default defineType({
  name: "route",
  title: "Vehicle Transport Route",
  type: "document",
  fields: [
    defineField({
      name: "fromCity",
      title: "From City",
      type: "reference",
      to: [{ type: "city" }],
    }),

    defineField({
      name: "toCity",
      title: "To City",
      type: "reference",
      to: [{ type: "city" }],
    }),

    defineField({
      name: "title",
      title: "Route Title",
      type: "string",
      description: "Example: Johannesburg to Cape Town Vehicle Transport",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),

    defineField({
      name: "heroText",
      title: "Hero Description",
      type: "text",
    }),
    defineField({
      name: "routeImage",
      title: "Route Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "transitTime",
      title: "Typical Transit Time",
      type: "string",
    }),

    // ⭐ NEW FIELD (homepage cards)
    defineField({
      name: "routeSummary",
      title: "Route Summary",
      type: "text",
      description: "Short description used on homepage route cards",
    }),

    // ⭐ NEW FIELD (featured routes)
    defineField({
      name: "featuredRoute",
      title: "Featured Route",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "content",
      title: "Route Content",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    }),

    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
    }),

    defineField({
      name: "seoImage",
      title: "SEO Image",
      type: "image",
    }),
  ],
});
