import { defineType, defineField } from "sanity";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Service Title",
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

    /* ---------------- Hero Section ---------------- */

    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
    }),

    defineField({
      name: "heroSubheading",
      title: "Hero Subheading",
      type: "text",
    }),

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "primaryCTA",
      title: "Primary CTA Text",
      type: "string",
    }),

    defineField({
      name: "secondaryCTA",
      title: "Secondary CTA Text",
      type: "string",
    }),

    /* ---------------- Intro Content ---------------- */

    defineField({
      name: "introText",
      title: "Introduction Text",
      type: "text",
    }),

    /* ---------------- Features ---------------- */

    defineField({
      name: "features",
      title: "Key Features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Feature Title",
              type: "string",
            },
            {
              name: "description",
              title: "Feature Description",
              type: "text",
            },
          ],
        },
      ],
    }),

    /* ---------------- Main Content ---------------- */

    defineField({
      name: "content",
      title: "Main Content",
      type: "array",
      of: [{ type: "block" }],
    }),

    /* ---------------- Route References ---------------- */

    defineField({
      name: "routes",
      title: "Related Routes",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "route" }],
        },
      ],
    }),

    /* ---------------- FAQ ---------------- */

    defineField({
      name: "faq",
      title: "FAQs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "question",
              title: "Question",
              type: "string",
            },
            {
              name: "answer",
              title: "Answer",
              type: "text",
            },
          ],
        },
      ],
    }),

    /* ---------------- SEO ---------------- */

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
