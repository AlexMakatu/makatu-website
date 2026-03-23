import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/queries/getSiteSettings";

type FooterLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

type SiteSettings = {
  siteTitle?: string;
  footerColumns?: FooterColumn[];
  footerText?: string;
};

export default async function Footer() {
  const settings: SiteSettings = await client.fetch(siteSettingsQuery);

  return (
    <footer className="bg-[#311d60] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {settings?.siteTitle || "Makatu"}
          </h3>
        </div>

        {/* Footer Columns */}
        {settings?.footerColumns?.map((column) => (
          <div key={column.title}>
            <h4 className="font-semibold mb-4">{column.title}</h4>

            <ul className="space-y-2 text-sm text-purple-200">
              {column.links?.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-500/30 mt-10 py-6 text-center text-sm text-purple-300">
        {settings?.footerText}
      </div>
    </footer>
  );
}
