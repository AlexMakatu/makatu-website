import { defineType, defineField } from "sanity";

export default defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
    }),

    defineField({
      name: "introText",
      title: "Intro Text",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),

    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
    }),

    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      description: "Include country code without + (example: 27821234567)",
      type: "string",
    }),

    defineField({
      name: "address",
      title: "Office Address",
      type: "text",
      rows: 2,
    }),

    defineField({
      name: "serviceAreas",
      title: "Service Areas",
      description: "Cities Makatu services",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "quoteCTA",
      title: "Quote Call To Action Text",
      type: "string",
    }),
  ],
});
