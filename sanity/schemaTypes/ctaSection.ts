import { defineType, defineField } from "sanity";

export default defineType({
  name: "ctaSection",
  title: "CTA Section",
  type: "object",

  fields: [
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "buttonLink",
      title: "Button Link",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "title",
    },
    prepare(selection) {
      return {
        title: selection.title || "CTA Section",
      };
    },
  },
});
