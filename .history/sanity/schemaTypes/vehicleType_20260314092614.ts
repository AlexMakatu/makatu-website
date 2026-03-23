import { defineType, defineField } from "sanity";

export default defineType({
  name: "vehicleType",
  title: "Vehicle Type",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Vehicle Type Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
