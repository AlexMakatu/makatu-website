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

    /* ✅ ADD THIS (ICON) */
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      options: { hotspot: true },
    }),

    /* OPTIONAL (only if you ever want images again) */
    defineField({
      name: "image",
      title: "Optional Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
