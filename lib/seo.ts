type BreadcrumbItem = {
  label: string;
  href?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${BASE_URL}${item.href}` : undefined,
    })),
  };
}

/* ---------------- SEO DEFAULTS ---------------- */

/** Trim to a max length on a word boundary (adds an ellipsis when cut). */
export function clampText(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:|-]+$/, "")}…`;
}

/** Returns the first non-empty string, or undefined. */
export function firstFilled(...values: (string | null | undefined)[]) {
  return values.find((v) => typeof v === "string" && v.trim().length > 0)?.trim();
}

export function routeSeoDefaults(from?: string, to?: string, title?: string) {
  const hasCities = Boolean(from && to);
  const pageTitle = hasCities
    ? `${from} to ${to} Car Transport | Prices & Quotes | Makatu`
    : `${title || "Vehicle Transport"} | Prices & Quotes | Makatu`;
  const shortTitle = hasCities
    ? `${from} to ${to} Car Transport | Makatu`
    : `${title || "Vehicle Transport"} | Makatu`;
  const description = hasCities
    ? `Door-to-door vehicle transport from ${from} to ${to}. See car transport prices, insured delivery and get a quick quote from Makatu today.`
    : "Door-to-door vehicle transport across South Africa. See car transport prices, insured delivery and get a quick quote from Makatu today.";
  return {
    title: pageTitle.length <= 65 ? pageTitle : clampText(shortTitle, 65),
    description: clampText(description, 155),
  };
}
