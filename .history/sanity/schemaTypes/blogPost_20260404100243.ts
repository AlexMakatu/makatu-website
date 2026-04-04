import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "seoImage",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),

    defineField({
      name: "body",
      title: "Old Content (legacy)",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      hidden: true,
    }),

    defineField({
      name: "sections",
      title: "Structured Sections",
      type: "array",
      of: [
        defineArrayMember({ type: "textSection" }),
        defineArrayMember({ type: "imageTextSection" }),
        defineArrayMember({ type: "faqSection" }),
        defineArrayMember({ type: "ctaSection" }),
      ],
      description:
        "Use this for all new blog posts. Enforces SEO structure and section order.",
    }),
    defineField({
      name: "sections",
      title: "Structured Sections",
      type: "array",
      of: [
        defineArrayMember({ type: "textSection" }),
        defineArrayMember({ type: "imageTextSection" }),
        defineArrayMember({ type: "faqSection" }),
        defineArrayMember({ type: "ctaSection" }),
      ],
      description:
        "Use this for all new blog posts. Enforces SEO structure and section order.",
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
      rows: 3,
    }),
    defineField({
      name: "relatedCities",
      title: "Related Cities",
      type: "array",
      of: [{ type: "reference", to: [{ type: "city" }] }],
    }),
  ],
});
