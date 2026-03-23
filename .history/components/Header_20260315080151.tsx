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
    <header className="sticky top-0 z-50 bg-[#311d60] shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-[80px] flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          {settings?.logo?.asset?.url && (
            <Image
              src={settings.logo.asset.url}
              alt={settings.siteTitle || "Makatu"}
              width={80}
              height={20}
              priority
              className="object-contain"
            />
          )}
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
          {settings?.navigation?.map((item) => {
            const normal = "hover:text-white transition";

            const highlight =
              "bg-white text-[#311d60] px-5 py-2 rounded-md font-semibold hover:bg-gray-100 transition";

            const className = item.highlight ? highlight : normal;

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
        </nav>

        {/* CTA BUTTONS */}
        <div className="flex items-center gap-4">
          <Link
            href="/get-a-quote"
            className="bg-white text-[#311d60] px-5 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Get a Quote
          </Link>

          <Link
            href="/portal"
            className="border border-white/40 text-white px-5 py-2 rounded-md hover:bg-white hover:text-[#311d60] transition"
          >
            Portal Login
          </Link>
        </div>
      </div>
    </header>
  );
}
