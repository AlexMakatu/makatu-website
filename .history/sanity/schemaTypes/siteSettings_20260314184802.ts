import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",

  fields: [
    /*
    ---------------------------
    GENERAL
    ---------------------------
    */

    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
    }),

    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
    }),

    /*
    ---------------------------
    BRANDING
    ---------------------------
    */

    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
    }),

    /*
    ---------------------------
    NAVIGATION
    ---------------------------
    */

    defineField({
      name: "navigation",
      title: "Main Navigation",
      type: "array",
      of: [
        {
          type: "object",
          name: "navItem",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
            }),

            defineField({
              name: "href",
              title: "URL",
              type: "string",
              description: "Example: /vehicle-transport",
            }),
          ],
        },
      ],
    }),

    /*
    ---------------------------
    CONTACT
    ---------------------------
    */

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
      name: "address",
      title: "Address",
      type: "text",
    }),

    /*
    ---------------------------
    SOCIAL LINKS
    ---------------------------
    */

    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "WhatsApp", value: "whatsapp" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Twitter / X", value: "twitter" },
                  { title: "YouTube", value: "youtube" },
                  { title: "TikTok", value: "tiktok" },
                ],
              },
            }),

            defineField({
              name: "url",
              title: "Profile URL",
              type: "url",
            }),
          ],
        },
      ],
    }),

    /*
    ---------------------------
    FOOTER
    ---------------------------
    */

    defineField({
      name: "footerColumns",
      title: "Footer Columns",
      type: "array",
      of: [
        {
          type: "object",
          name: "footerColumn",
          fields: [
            defineField({
              name: "title",
              title: "Column Title",
              type: "string",
            }),

            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "label",
                      title: "Label",
                      type: "string",
                    },
                    {
                      name: "href",
                      title: "URL",
                      type: "string",
                    },
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),

    defineField({
      name: "footerText",
      title: "Footer Bottom Text",
      type: "string",
      description: "Example: © Makatu 2026. All rights reserved.",
    }),
  ],
});
