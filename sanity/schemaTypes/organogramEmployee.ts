import { defineField, defineType } from "sanity";

export default defineType({
  name: "organogramEmployee",
  title: "Organogram Employee",
  type: "document",
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "employmentType",
      title: "Employment Type",
      type: "string",
      options: {
        list: [
          { title: "Director", value: "director" },
          { title: "Full-Time Employee", value: "full-time" },
          { title: "Part-Time Employee", value: "part-time" },
          { title: "Consultant", value: "consultant" },
          { title: "External Professional", value: "external-professional" },
          { title: "Contractor", value: "contractor" },
        ],
      },
      initialValue: "full-time",
    }),
    defineField({
      name: "leadershipLevel",
      title: "Leadership Level",
      type: "string",
      options: {
        list: [
          {
            title: "Executive Leadership",
            value: "executive",
          },
          {
            title: "Senior Management",
            value: "senior-management",
          },
          {
            title: "Management",
            value: "management",
          },
          {
            title: "Professional Services",
            value: "professional-services",
          },
          {
            title: "Operations",
            value: "operations",
          },
        ],
      },
    }),
    defineField({
      name: "yearsExperience",
      title: "Years Experience",
      type: "number",
    }),

    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "reference",
      to: [{ type: "organogramDepartment" }],
    }),
    defineField({
      name: "reportsTo",
      title: "Reports To",
      type: "reference",
      to: [{ type: "organogramEmployee" }],
      description: "Leave empty for CEO / top-level leadership.",
    }),
    defineField({
      name: "location",
      title: "Location / Depot",
      type: "string",
    }),
    defineField({
      name: "bio",
      title: "Short Bio",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "leadershipProfile",
      title: "Leadership Profile",
      type: "text",
      rows: 8,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "showOnPublicPage",
      title: "Show On Public Page",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "fullName",
      subtitle: "position",
      media: "photo",
    },
  },
});
