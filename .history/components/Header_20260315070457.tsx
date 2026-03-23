import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/queries/getSiteSettings";

type SanityImage = {
  asset?: {
    url?: string;
  };
};

type SiteSettings = {
  siteTitle?: string;
  logo?: SanityImage;
};

export default async function Header() {
  const settings: SiteSettings = await client.fetch(siteSettingsQuery);

  return (
    <header className="bg-[#311d60] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          {settings?.logo?.asset?.url && (
            <Image
              src={settings.logo.asset.url}
              alt={settings.siteTitle || "Makatu"}
              width={120}
              height={60}
            />
          )}
        </Link>

        <nav className="flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-purple-200">
            Home
          </Link>

          <Link href="/vehicle-transport" className="hover:text-purple-200">
            Vehicle Transport
          </Link>

          <Link href="/contact" className="hover:text-purple-200">
            Contact
          </Link>

          <Link
            href="/portal"
            className="ml-4 bg-white text-[#311d60] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
          >
            Portal Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
