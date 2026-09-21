import { defineField, defineType } from "sanity";

export default defineType({
  name: "organogramSettings",
  title: "Organogram Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Makatu Organogram",
    }),
    defineField({
      name: "introText",
      title: "Intro Text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "showPhotos",
      title: "Show Photos",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showDepartmentBreakdown",
      title: "Show Department Breakdown",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showDownloadButton",
      title: "Show Download Button",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
