import { defineType, defineField } from "sanity";

export default defineType({
  name: "vehicleTransportPage",
  title: "Vehicle Transport Page",
  type: "document",

  fields: [
    /*
    PAGE TITLE
    */

    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Vehicle Transport",
      validation: (Rule) => Rule.required(),
    }),

    /*
    HERO SECTION
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
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    }),

    /*
    INTRO SECTION
    */

    defineField({
      name: "introduction",
      title: "Introduction",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "introImage",
      title: "Intro Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    }),

    /*
    VEHICLE TYPES GRID
    */

    defineField({
      name: "vehicleTypes",
      title: "Vehicle Types",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
            },

            {
              name: "description",
              title: "Description",
              type: "text",
            },

            {
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                },
              ],
            },
          ],
        },
      ],
    }),

    /*
    CUSTOMER TYPES GRID
    */

    defineField({
      name: "customerTypes",
      title: "Customer Types",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
            },

            {
              name: "description",
              title: "Description",
              type: "text",
            },

            {
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                },
              ],
            },
          ],
        },
      ],
    }),

    /*
    CERTIFICATIONS SECTION
    */

    defineField({
      name: "certifications",
      title: "Certifications",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Certification Name",
              type: "string",
            },

            {
              name: "issuer",
              title: "Issuing Organization",
              type: "string",
            },

            {
              name: "logo",
              title: "Certification Logo",
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                },
              ],
            },

            {
              name: "description",
              title: "Description",
              type: "text",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "seoContent",
      title: "SEO Content",
      type: "array",
      of: [
        { type: "block" },

        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
            },
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
            {
              name: "name",
              title: "Partner Name",
              type: "string",
            },

            {
              name: "logo",
              title: "Logo",
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                },
              ],
            },
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
