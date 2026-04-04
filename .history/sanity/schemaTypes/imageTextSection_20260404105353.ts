import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "imageTextSection",
  title: "Image + Text Section",
  type: "object",

  fields: [
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Image Left", value: "imageLeft" },
          { title: "Image Right", value: "imageRight" },
        ],
        layout: "radio",
      },
      initialValue: "imageLeft",
    }),

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
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "content",
      title: "Text Content",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
          ],
          lists: [{ title: "Bullet", value: "bullet" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      layout: "layout",
      media: "image",
    },
    prepare(selection) {
      const layout =
        selection.layout === "imageRight" ? "Image Right" : "Image Left";

      return {
        title: `Image + Text (${layout})`,
        media: selection.media,
      };
    },
  },
});
