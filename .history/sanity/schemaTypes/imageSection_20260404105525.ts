import { defineType, defineField } from "sanity";

export default defineType({
  name: "imageSection",
  title: "Image Section",
  type: "object",

  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],

  preview: {
    select: {
      title: "caption",
      media: "image",
    },
    prepare(selection) {
      return {
        title: selection.title || "Image Section",
        media: selection.media,
      };
    },
  },
});
