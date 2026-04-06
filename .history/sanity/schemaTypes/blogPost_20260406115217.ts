import { defineType, defineField, defineArrayMember } from "sanity";

type TextSection = {
  _type: "textSection";
  sectionKey: string;
};

type ImageTextSection = {
  _type: "imageTextSection";
};

type FAQSection = {
  _type: "faqSection";
};

type CTASection = {
  _type: "ctaSection";
};

type Section = TextSection | ImageTextSection | FAQSection | CTASection;

/* ---------------- STRICT PORTABLE TEXT TYPES ---------------- */

type PortableTextChild = {
  text?: string;
};

type PortableTextBlockWithChildren = {
  children?: PortableTextChild[];
};

type SectionWithContent = Section & {
  content?: PortableTextBlockWithChildren[];
  questions?: { question: string; answer: string }[];
};

/* ---------------- TEXT EXTRACTOR ---------------- */

function extractText(sections: Section[]): string {
  let text = "";

  sections.forEach((section) => {
    const s = section as SectionWithContent;

    if (s.content) {
      s.content.forEach((block) => {
        if (block.children) {
          block.children.forEach((child) => {
            if (child.text) {
              text += " " + child.text;
            }
          });
        }
      });
    }

    if (s.questions) {
      s.questions.forEach((q) => {
        text += " " + q.question + " " + q.answer;
      });
    }
  });

  return text;
}

export default defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "seoImage",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),

    defineField({
      name: "body",
      title: "Old Content (legacy)",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      hidden: true,
    }),

    defineField({
      name: "sections",
      title: "Structured Sections",
      type: "array",
      of: [
        defineArrayMember({ type: "textSection" }),
        defineArrayMember({ type: "imageTextSection" }),
        defineArrayMember({ type: "faqSection" }),
        defineArrayMember({ type: "ctaSection" }),
      ],

      validation: (Rule) =>
        Rule.required().custom((sections: unknown) => {
          if (!Array.isArray(sections)) return "Sections are required";

          const safeSections = sections as Section[];
          if (safeSections.length === 0) return "Sections are required";

          /* ---------------- ORDER ---------------- */

          const expectedOrder = [
            "intro",
            "quickAnswer",
            "cost",
            "process",
            "factors",
            "tips",
            "internalLinks",
            "faqSection",
            "ctaSection",
          ];

          const actualOrder = safeSections.map((section) => {
            if (section._type === "textSection") return section.sectionKey;
            if (section._type === "imageTextSection") return "process";
            return section._type;
          });

          for (let i = 0; i < expectedOrder.length; i++) {
            if (actualOrder[i] !== expectedOrder[i]) {
              return `Section order incorrect. Expected "${expectedOrder[i]}" at position ${i + 1}`;
            }
          }

          /* ---------------- REQUIRED ---------------- */

          if (!safeSections.some((s) => s._type === "faqSection"))
            return "FAQ section is required";

          if (!safeSections.some((s) => s._type === "ctaSection"))
            return "CTA section is required";

          /* ---------------- INTERNAL LINKS ---------------- */

          const allText = JSON.stringify(safeSections);

          if (!allText.includes("/vehicle-transport"))
            return "Must include /vehicle-transport link";

          const routeLinks = (
            allText.match(/\/vehicle-transport\/[a-z0-9-]+/g) || []
          ).length;

          if (routeLinks < 3) return "Must include at least 3 route links";

          if (!allText.includes("/get-a-quote"))
            return "Must include /get-a-quote link";

          /* ---------------- BLOCKED TERMS ---------------- */

          if (/depot-to-depot/i.test(allText))
            return "Depot-to-depot is not allowed";

          /* ---------------- WORD COUNT ---------------- */

          const plainText = extractText(safeSections);
          const wordCount = plainText.split(/\s+/).filter(Boolean).length;

          if (wordCount < 800) return "Article must be at least 800 words";

          /* ---------------- CITY CHECK ---------------- */

          const cityMatches =
            allText.match(
              /(Johannesburg|Cape Town|Durban|Pretoria|Port Elizabeth|Bloemfontein)/gi,
            ) || [];

          if (cityMatches.length < 2)
            return "Must include at least 2 South African cities";

          /* ---------------- PRICE CHECK ---------------- */

          if (!/R\s?\d[\d,]*/i.test(allText))
            return "Must include at least one price (R value)";

          /* ---------------- INTRO ---------------- */

          const intro = safeSections.find(
            (s) => s._type === "textSection" && s.sectionKey === "intro",
          );

          if (intro) {
            const text = JSON.stringify(intro).toLowerCase();

            if (!text.includes("vehicle transport"))
              return "Intro must include keyword";

            if (!text.includes("/vehicle-transport"))
              return "Intro must include /vehicle-transport link";
          }

          /* ---------------- QUICK ANSWER ---------------- */

          const quick = safeSections.find(
            (s) => s._type === "textSection" && s.sectionKey === "quickAnswer",
          );

          if (quick) {
            const text = JSON.stringify(quick);
            const bullets = (text.match(/•|- /g) || []).length;

            if (bullets === 0) return "Quick answer must use bullets";
            if (bullets > 6) return "Max 6 bullets";
          }

          /* ---------------- COST ---------------- */

          const cost = safeSections.find(
            (s) => s._type === "textSection" && s.sectionKey === "cost",
          );

          if (cost) {
            const text = JSON.stringify(cost);

            const routes = (
              text.match(
                /(Johannesburg|Cape Town|Durban|Pretoria)\s+to\s+(Johannesburg|Cape Town|Durban|Pretoria)/gi,
              ) || []
            ).length;

            if (routes < 2)
              return "Cost section must include at least 2 route examples";

            if (!/R\s?\d[\d,]*/i.test(text))
              return "Cost section must include pricing";
          }

          return true;
        }),
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
      rows: 3,
    }),

    defineField({
      name: "relatedCities",
      title: "Related Cities",
      type: "array",
      of: [{ type: "reference", to: [{ type: "city" }] }],
    }),
  ],
});
