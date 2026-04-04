import { defineType, defineField } from "sanity";

export default defineType({
  name: "seoImage",
  title: "SEO Image",
  type: "object",
  fields: [
    defineField({
      name: "asset",
      title: "Image",
      type: "image", // ✅ CRITICAL: MUST be "image"
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      description:
        'Must include "car transport" or "vehicle transport" and be under 125 characters.',
      validation: (Rule) =>
        Rule.required()
          .max(125)
          .custom((value) => {
            if (!value) return "Alt text is required";

            if (!/(car transport|vehicle transport)/i.test(value)) {
              return 'Must include "car transport" or "vehicle transport"';
            }

            if (/image of|picture of|photo of/i.test(value)) {
              return "Do not use generic phrases";
            }

            return true;
          }),
    }),
  ],
});
