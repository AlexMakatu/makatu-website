import { defineField, defineType } from "sanity";

export default defineType({
  name: "organogramDepartment",
  title: "Organogram Department",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Department Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
