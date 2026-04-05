type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `https://yourdomain.com${item.href}` : undefined,
    })),
  };
}
