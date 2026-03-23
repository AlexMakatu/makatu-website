import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/queries/getSiteSettings";

type NavItem = {
  label: string;
  href: string;
  highlight?: boolean;
  external?: boolean;
};

type SiteSettings = {
  siteTitle?: string;
  logo?: {
    asset?: {
      url?: string;
    };
  };
  navigation?: NavItem[];
};

export default async function Header() {
  const settings: SiteSettings = await client.fetch(siteSettingsQuery);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#311d60]/90 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          {settings?.logo?.asset?.url && (
            <Image
              src={settings.logo.asset.url}
              alt={settings.siteTitle || "Makatu"}
              width={110}
              height={50}
              priority
              className="object-contain"
            />
          )}
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {settings?.navigation?.map((item) => {
            const baseStyle =
              "text-white/80 hover:text-white transition-colors duration-200";

            const highlightStyle =
              "bg-white text-[#311d60] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition";

            const className = item.highlight ? highlightStyle : baseStyle;

            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link key={item.href} href={item.href} className={className}>
                {item.label}
              </Link>
            );
          })}

          {/* Portal Button */}
          <Link
            href="/portal"
            className="ml-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-md hover:bg-white/20 transition"
          >
            Portal Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
