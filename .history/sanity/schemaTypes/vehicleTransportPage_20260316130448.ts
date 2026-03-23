import { defineType, defineField } from "sanity";

export default defineType({
  name: "vehicleTransportPage",
  title: "Vehicle Transport Page",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Vehicle Transport",
      validation: (Rule) => Rule.required(),
    }),

    /*
    HERO
    */

    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
    }),

    defineField({
      name: "heroText",
      title: "Hero Text",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),

    /*
    INTRO
    */

    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 5,
    }),

    /*
    VEHICLE TYPES
    */

    defineField({
      name: "vehicleTypes",
      title: "Vehicle Types",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "text" },
          ],
        },
      ],
    }),

    /*
    CUSTOMER TYPES
    */

    defineField({
      name: "customerTypes",
      title: "Customer Types",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "text" },
          ],
        },
      ],
    }),

    /*
    PARTNERS
    */

    defineField({
      name: "partners",
      title: "Partners",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string" },
            { name: "logo", title: "Logo", type: "image" },
          ],
        },
      ],
    }),

    /*
    CTA
    */

    defineField({
      name: "ctaTitle",
      title: "CTA Title",
      type: "string",
    }),

    defineField({
      name: "ctaText",
      title: "CTA Text",
      type: "text",
    }),
  ],
});
