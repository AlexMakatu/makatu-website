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
      description: "Example: Johannesburg to Cape Town Vehicle Transport",
    }),

    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: {
        source: (doc: any) => {
          const from = doc?.fromCity?._ref || "";
          const to = doc?.toCity?._ref || "";
          return `${from}-${to}-vehicle-transport`;
        },
        maxLength: 96,
      },
    }),

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
      name: "heroText",
      title: "Hero Description",
      type: "text",
    }),

    defineField({
      name: "transitTime",
      title: "Typical Transit Time",
      type: "string",
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
