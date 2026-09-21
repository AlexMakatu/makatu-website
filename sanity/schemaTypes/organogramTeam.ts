import { defineField, defineType } from "sanity";

export default defineType({
  name: "organogramTeam",
  title: "Organogram Team",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Team Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "reference",
      to: [{ type: "organogramDepartment" }],
    }),
    defineField({
      name: "location",
      title: "Location / Depot",
      type: "string",
      description: "Example: Kempton Park, Rosslyn",
    }),
    defineField({
      name: "headCount",
      title: "Head Count",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "reportsTo",
      title: "Reports To",
      type: "reference",
      to: [{ type: "organogramEmployee" }],
      description: "Manager or supervisor responsible for this team.",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "location",
    },
  },
});
