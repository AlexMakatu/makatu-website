import { defineType, defineField } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",

  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "answer",
      title: "Answer",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "relatedRoutes",
      title: "Related Routes",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "route" }],
        },
      ],
    }),

    defineField({
      name: "relatedBlogPosts",
      title: "Related Blog Posts",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "blogPost" }],
        },
      ],
    }),

    defineField({
      name: "showOn",
      title: "Show On Pages",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Vehicle Transport Page", value: "vehicleTransport" },
          { title: "Homepage", value: "homepage" },
          { title: "Route Pages", value: "route" },
        ],
      },
    }),

    defineField({
      name: "priority",
      title: "Priority",
      type: "number",
      description: "Lower number appears first",
    }),
  ],
});
