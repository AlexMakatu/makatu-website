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
    }),

    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      type: "string",
    }),

    defineField({
      name: "ctaText",
      title: "CTA Text",
      type: "string",
    }),

    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    }),

    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
    }),
  ],
});
