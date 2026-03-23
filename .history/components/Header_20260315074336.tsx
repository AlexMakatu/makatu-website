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
      <div className="max-w-7xl mx-auto px-6 h-[90px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          {settings?.logo?.asset?.url && (
            <Image
              src={settings.logo.asset.url}
              alt={settings.siteTitle || "Makatu"}
              width={170}
              height={70}
              priority
              className="object-contain -mt-1"
            />
          )}
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {settings?.navigation?.map((item) => {
            const normal = "text-white/90 hover:text-white transition";

            const highlight =
              "bg-white text-[#311d60] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition";

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

          {/* Portal Login */}
          <Link
            href="/portal"
            className="ml-2 bg-white text-[#311d60] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Portal Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
