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
      readOnly: true,
      initialValue: (doc) => {
        if (!doc?.fromCity || !doc?.toCity) return "";
        return `${doc.fromCity} to ${doc.toCity} Vehicle Transport`;
      },
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
