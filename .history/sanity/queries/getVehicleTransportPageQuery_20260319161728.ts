import { defineType, defineField } from "sanity";

const backgroundOptions = [
  { title: "White", value: "bg-white" },
  { title: "Light Gray", value: "bg-gray-50" },
  { title: "Purple (Light)", value: "bg-purple-50" }, // 👈 NEW
  { title: "Purple (Dark)", value: "bg-purple-900 text-white" }, // 👈 FIXED
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
    HERO
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
      fields: [{ name: "alt", type: "string", title: "Alt Text" }],
    }),

    /*
    INTRO
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
      of: [{ type: "block" }],
    }),

    defineField({
      name: "introImage",
      title: "Intro Image",
      type: "image",
      fieldset: "intro",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt Text" }],
    }),

    /*
    VEHICLE TYPES
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
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "description", type: "text", title: "Description" },
            {
              name: "icon",
              title: "Icon",
              type: "image",
              options: { hotspot: true },
              fields: [{ name: "alt", type: "string" }],
            },
          ],
        },
      ],
    }),

    /*
    CUSTOMER TYPES
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
          fields: [
            { name: "title", type: "string" },
            { name: "description", type: "text" },
            {
              name: "image",
              type: "image",
              options: { hotspot: true },
              fields: [{ name: "alt", type: "string" }],
            },
          ],
        },
      ],
    }),

    /*
    CERTIFICATIONS
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
          fields: [
            { name: "name", type: "string" },
            { name: "issuer", type: "string" },
            { name: "description", type: "text" },
            {
              name: "logo",
              type: "image",
              options: { hotspot: true },
              fields: [{ name: "alt", type: "string" }],
            },
          ],
        },
      ],
    }),

    /*
    CTA
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
      type: "string",
      fieldset: "cta",
    }),

    defineField({
      name: "ctaText",
      type: "text",
      fieldset: "cta",
    }),
  ],
});
