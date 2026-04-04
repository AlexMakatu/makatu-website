import { defineType, defineField } from "sanity";

export default defineType({
  name: "seoImage",
  title: "SEO Image",
  type: "object",
  fields: [
    defineField({
      name: "asset",
      title: "Image",
      type: "image", // ✅ MUST be image
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .max(125)
          .custom((value) => {
            if (!value) return "Alt text is required";

            if (!/(car transport|vehicle transport)/i.test(value)) {
              return 'Must include "car transport" or "vehicle transport"';
            }

            if (/image of|picture of|photo of/i.test(value)) {
              return "No generic phrases allowed";
            }

            return true;
          }),
    }),
  ],
});
