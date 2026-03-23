import { defineType, defineField } from "sanity";

const backgroundOptions = [
  { title: "White", value: "bg-white" },
  { title: "Light Gray", value: "bg-gray-50" },

  // ✅ NEW
  { title: "Purple (Light)", value: "bg-purple-50" },
  { title: "Purple (Dark)", value: "bg-purple-900" },

  // Optional fallback dark
  { title: "Dark", value: "bg-gray-900" },
];
export default defineType({
  name: "vehicleTransportPage",
  title: "Vehicle Transport Page",
  type: "document",

  fieldsets: [
    { name: "hero", title: "Hero Section" },
    { name: "intro", title: "Introduction" },
    { name: "vehicles", title: "Vehicle Types" },
    { name: "customers", title: "Customer Types" },
    { name: "certifications", title: "Certifications" },
    { name: "seo", title: "SEO Content" },
    { name: "partners", title: "Partners" },
    { name: "cta", title: "Call To Action" },
  ],

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
      name: "heroBackground",
      title: "Hero Background",
      type: "string",
      fieldset: "hero",
      initialValue: "bg-white",
      options: {
        list: backgroundOptions,
        layout: "radio",
      },
    }),

    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      fieldset: "hero",
    }),

    defineField({
      name: "heroText",
      title: "Hero Text",
      type: "text",
      rows: 3,
      fieldset: "hero",
    }),

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      fieldset: "hero",
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
      name: "introBackground",
      title: "Introduction Background",
      type: "string",
      fieldset: "intro",
      initialValue: "bg-white",
      options: {
        list: backgroundOptions,
        layout: "radio",
      },
    }),

    defineField({
      name: "introduction",
      title: "Introduction Content",
      type: "array",
      fieldset: "intro",
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

    defineField({
      name: "introImage",
      title: "Intro Image",
      type: "image",
      fieldset: "intro",
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
      name: "vehicleTypesBackground",
      title: "Vehicle Types Background",
      type: "string",
      fieldset: "vehicles",
      initialValue: "bg-gray-50",
      options: {
        list: backgroundOptions,
        layout: "radio",
      },
    }),

    defineField({
      name: "vehicleTypes",
      title: "Vehicle Types",
      type: "array",
      fieldset: "vehicles",
      of: [
        {
          type: "object",
          name: "vehicleTypeItem",
          title: "Vehicle Type",
          preview: {
            select: {
              title: "title",
              media: "image",
            },
          },
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
              rows: 3,
            },
            {
              name: "icon",
              title: "Icon",
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
      name: "customerTypesBackground",
      title: "Customer Types Background",
      type: "string",
      fieldset: "customers",
      initialValue: "bg-white",
      options: {
        list: backgroundOptions,
        layout: "radio",
      },
    }),

    defineField({
      name: "customerTypes",
      title: "Customer Types",
      type: "array",
      fieldset: "customers",
      of: [
        {
          type: "object",
          name: "customerTypeItem",
          title: "Customer Type",
          preview: {
            select: {
              title: "title",
              media: "image",
            },
          },
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
              rows: 3,
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
      name: "certificationsBackground",
      title: "Certifications Background",
      type: "string",
      fieldset: "certifications",
      initialValue: "bg-gray-50",
      options: {
        list: backgroundOptions,
        layout: "radio",
      },
    }),

    defineField({
      name: "certifications",
      title: "Certifications",
      type: "array",
      fieldset: "certifications",
      of: [
        {
          type: "object",
          name: "certificationItem",
          title: "Certification",
          preview: {
            select: {
              title: "name",
              subtitle: "issuer",
              media: "logo",
            },
          },
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
              rows: 3,
            },
          ],
        },
      ],
    }),

    /*
    SEO CONTENT
    */

    defineField({
      name: "seoBackground",
      title: "SEO Content Background",
      type: "string",
      fieldset: "seo",
      initialValue: "bg-white",
      options: {
        list: backgroundOptions,
        layout: "radio",
      },
    }),

    defineField({
      name: "seoContent",
      title: "SEO Content",
      type: "array",
      fieldset: "seo",
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
      name: "partnersBackground",
      title: "Partners Background",
      type: "string",
      fieldset: "partners",
      initialValue: "bg-gray-50",
      options: {
        list: backgroundOptions,
        layout: "radio",
      },
    }),

    defineField({
      name: "partners",
      title: "Partners",
      type: "array",
      fieldset: "partners",
      of: [
        {
          type: "object",
          name: "partnerItem",
          title: "Partner",
          preview: {
            select: {
              title: "name",
              media: "logo",
            },
          },
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
    CTA SECTION
    */

    defineField({
      name: "ctaBackground",
      title: "CTA Background",
      type: "string",
      fieldset: "cta",
      initialValue: "bg-white",
      options: {
        list: backgroundOptions,
        layout: "radio",
      },
    }),

    defineField({
      name: "ctaTitle",
      title: "CTA Title",
      type: "string",
      fieldset: "cta",
    }),

    defineField({
      name: "ctaText",
      title: "CTA Text",
      type: "text",
      fieldset: "cta",
    }),
  ],
});
