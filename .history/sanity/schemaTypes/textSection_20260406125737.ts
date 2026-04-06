import { defineType, defineField } from "sanity";

export default defineType({
  name: "textSection",
  title: "Text Section",
  type: "object",

  fields: [
    // ✅ THIS IS THE CRITICAL FIELD (YOU WERE MISSING THIS)
    defineField({
      name: "sectionKey",
      title: "Section Type",
      type: "string",
      options: {
        list: [
          { title: "Intro", value: "intro" },
          { title: "Quick Answer", value: "quickAnswer" },
          { title: "Cost", value: "cost" },
          { title: "Factors", value: "factors" },
          { title: "Tips", value: "tips" },
          { title: "Internal Links", value: "internalLinks" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),

    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
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
      ],
    }),
  ],
});
