"use client";

import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/queries/getSiteSettings";
import { useEffect, useState } from "react";

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

export default function Header() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await client.fetch(siteSettingsQuery);
        setSettings(data);
      } catch (err) {
        console.error("Failed to load site settings", err);
      }
    }
    fetchSettings();
  }, []);

  // ✅ FALLBACK NAVIGATION (THIS FIXES YOUR ISSUE)
  const navigation: NavItem[] = settings?.navigation ?? [
    { label: "Vehicle Transport", href: "/vehicle-transport" },
    { label: "Transport Guide", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Get a Quote", href: "/get-a-quote", highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#311d60] shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          {settings?.logo?.asset?.url ? (
            <Image
              src={settings.logo.asset.url}
              alt={settings.siteTitle || "Makatu"}
              width={180}
              height={60}
              priority
              className="h-[42px] md:h-[46px] w-auto object-contain"
            />
          ) : (
            <span className="text-white font-bold text-lg">Makatu</span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-base font-medium text-white/90">
          {navigation.map((item) => {
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

          <Link
            href="https://supportitmakatu.zohocreatorportal.com/"
            className="border border-white/40 text-white px-5 py-2 rounded-md hover:bg-white hover:text-[#311d60] transition"
          >
            Portal Login
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-[#311d60] border-t border-white/10"
        >
          <div className="px-4 py-6 flex flex-col gap-4 text-white text-lg">
            {navigation.map((item) => {
              if (item.external) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2"
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/portal"
              onClick={() => setMenuOpen(false)}
              className="mt-2 bg-white text-[#311d60] py-3 rounded-md text-center font-semibold"
            >
              Portal Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
