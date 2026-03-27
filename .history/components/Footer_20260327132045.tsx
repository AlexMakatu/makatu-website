import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/queries/getSiteSettings";

import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  MessageCircle,
} from "lucide-react";

/* -----------------------------
Types
----------------------------- */

type FooterLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

type SocialLink = {
  platform: string;
  url: string;
};

type SanityImage = {
  asset?: {
    url?: string;
  };
};

type FooterData = {
  description?: string;
  columns?: FooterColumn[];
  copyright?: string;
};

type SiteSettings = {
  siteTitle?: string;
  logo?: SanityImage;
  socialLinks?: SocialLink[];
  footer?: FooterData;
};

/* -----------------------------
Social Icons
----------------------------- */

const socialIconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  whatsapp: MessageCircle,
};

/* -----------------------------
Component
----------------------------- */

export default async function Footer() {
  const settings: SiteSettings = await client.fetch(siteSettingsQuery);

  return (
    <footer className="text-white bg-[linear-gradient(180deg,#311d60_0%,#2a1854_60%,#1f113f_100%)]">
      {/* TRANSPORT STATS */}

      <div className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-purple-200">
              Coverage
            </p>

            <p className="text-3xl md:text-4xl font-semibold mt-2">
              Nationwide
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-purple-200">
              Service
            </p>

            <p className="text-3xl md:text-4xl font-semibold mt-2">
              Door-to-Door
              <span className="text-base md:text-lg ml-2 text-purple-200">
                Transport
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.8fr_0.8fr] gap-10 md:gap-12">
          {/* BRAND */}

          <div>
            {settings?.logo?.asset?.url && (
              <Image
                src={settings.logo.asset.url}
                alt={settings.siteTitle || "Makatu"}
                width={150}
                height={80}
                className="opacity-95 mix-blend-lighten"
              />
            )}

            <p className="mt-5 text-sm text-purple-100/80 max-w-md leading-relaxed">
              {settings?.footer?.description ||
                "Reliable nationwide vehicle transport across South Africa, delivering cars safely and efficiently."}
            </p>

            {/* SOCIAL ICONS */}

            <div className="flex gap-3 mt-5">
              {settings?.socialLinks?.map((social) => {
                const Icon = socialIconMap[social.platform];
                if (!Icon) return null;

                return (
                  <Link
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition hover:bg-white/15 hover:scale-105"
                  >
                    <Icon size={17} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* FOOTER COLUMNS */}

          {settings?.footer?.columns?.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold tracking-wide">
                {column.title}
              </h3>

              <ul className="mt-4 space-y-3">
                {column.links?.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-purple-100/75 hover:text-white transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM BAR */}

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-purple-100/70">
          <span className="text-center md:text-left">
            {settings?.footer?.copyright ||
              `© ${new Date().getFullYear()} Makatu Vehicle Transport`}
          </span>

          <div className="flex gap-6 mt-3 md:mt-0">
            <Link
              href="/legal/privacy-policy"
              className="hover:text-white transition"
            >
              Privacy
            </Link>

            <Link href="/legal/terms" className="hover:text-white transition">
              Terms
            </Link>

            <Link href="/legal/banking" className="hover:text-white transition">
              Banking Details
            </Link>

            <Link href="/legal/banking" className="hover:text-white transition">
              Documents
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
