import { defineType, defineField } from "sanity";

export default defineType({
  name: "faqSection",
  title: "FAQ Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Frequently Asked Questions",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "questions",
      title: "Questions",
      type: "array",
      of: [{ type: "faqItem" }],
      validation: (Rule) =>
        Rule.required().min(3).max(5).error("Must have 3–5 questions"),
    }),
  ],
});
