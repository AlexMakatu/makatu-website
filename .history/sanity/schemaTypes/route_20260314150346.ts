import { defineType, defineField } from "sanity";

export default defineType({
  name: "route",
  title: "Vehicle Transport Route",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Route Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Example: Johannesburg to Durban Vehicle Transport",
    }),

    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "fromCity",
      title: "From City",
      type: "reference",
      to: [{ type: "city" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "toCity",
      title: "To City",
      type: "reference",
      to: [{ type: "city" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "heroText",
      title: "Hero Description",
      type: "text",
      rows: 3,
      description: "Short description shown under the hero heading",
    }),

    defineField({
      name: "routeImage",
      title: "Route Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "transitTime",
      title: "Typical Transit Time (Days)",
      type: "number",
      description: "Example: 1 or 2 days",
    }),

    defineField({
      name: "introduction",
      title: "Route Introduction",
      type: "text",
      rows: 4,
      description: "Intro paragraph explaining the route",
    }),

    defineField({
      name: "benefits",
      title: "Why Choose Makatu",
      type: "array",
      of: [{ type: "string" }],
      description: "Bullet points shown on the route page",
    }),

    defineField({
      name: "seoContent",
      title: "SEO Content",
      type: "text",
      rows: 6,
      description: "Long-form SEO content for this route",
    }),

    defineField({
      name: "featuredRoute",
      title: "Featured Route",
      type: "boolean",
      initialValue: false,
      description: "Show this route on the homepage",
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
  ],
});
