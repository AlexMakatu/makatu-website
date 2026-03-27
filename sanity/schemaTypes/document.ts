import { defineType, defineField } from "sanity";

export default defineType({
  name: "documentFile",
  title: "Document",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "file",
      title: "File",
      type: "file",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Legal", value: "legal" },
          { title: "Certificate", value: "certificate" },
          { title: "Compliance", value: "compliance" },
        ],
      },
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),

    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "date",
    }),
  ],
});
