import { defineType, defineField } from "sanity";

export default defineType({
  name: "review",
  title: "Customer Reviews",
  type: "document",
  fields: [
    defineField({
      name: "author",
      title: "Reviewer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
    }),

    defineField({
      name: "text",
      title: "Review Text",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "source",
      title: "Review Source",
      type: "string",
      options: {
        list: [
          { title: "Google", value: "google" },
          { title: "Wisemove", value: "wisemove" },
          { title: "HelloPeter", value: "hellopeter" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "reviewUrl",
      title: "Original Review URL",
      type: "url",
      description: "Link to the real review for credibility",
    }),

    defineField({
      name: "featured",
      title: "Featured Review",
      type: "boolean",
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: "author",
      subtitle: "source",
    },
  },
});
