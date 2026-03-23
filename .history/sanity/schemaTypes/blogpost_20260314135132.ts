import { defineType, defineField } from "sanity";

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

    ```
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
  description: "Short summary used on blog cards and SEO previews",
  validation: (Rule) => Rule.max(200),
}),

defineField({
  name: "mainImage",
  title: "Main Image",
  type: "image",
  options: {
    hotspot: true,
  },
}),

defineField({
  name: "publishedAt",
  title: "Published At",
  type: "datetime",
}),

defineField({
  name: "content",
  title: "Article Content",
  description:
    "Build the article using headings, text, images, and CTA banners.",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
      ],
      lists: [
        { title: "Bullet List", value: "bullet" },
        { title: "Numbered List", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
              },
            ],
          },
        ],
      },
    },

    {
      type: "image",
      title: "Image",
      options: { hotspot: true },
    },

    {
      name: "ctaBanner",
      title: "CTA Banner",
      type: "object",
      fields: [
        { name: "text", title: "Text", type: "string" },
        { name: "buttonText", title: "Button Text", type: "string" },
        { name: "buttonLink", title: "Button Link", type: "string" },
      ],
    },
  ],
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
```,
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "mainImage",
    },
  },
});
