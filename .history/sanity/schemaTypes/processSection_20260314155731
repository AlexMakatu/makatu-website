import { defineType, defineField } from "sanity";

export default defineType({
  name: "processSection",
  title: "Process Section",
  type: "document",

  fields: [
    defineField({
      name: "page",
      title: "Page",
      type: "string",
      description: "Example: vehicleTransport, homepage",
    }),

    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
    }),

    defineField({
      name: "steps",
      title: "Process Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Step Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "image",
              options: { hotspot: true },
            }),
          ],
        },
      ],
    }),
  ],
});
