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
    <footer className="bg-[#311d60] text-white mt-20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          {settings?.logo?.asset?.url && (
            <Image
              src={settings.logo.asset.url}
              alt={settings.siteTitle || "Makatu"}
              width={125}
              height={65}
              className="opacity-90"
            />
          )}

          <p className="text-purple-200 text-sm leading-relaxed">
            {settings?.footer?.description}
          </p>

          {/* Social Icons */}
          <div className="flex gap-3 pt-2">
            {settings?.socialLinks?.map((social) => {
              const Icon = socialIconMap[social.platform];
              if (!Icon) return null;

              return (
                <Link
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  className="text-purple-200 hover:text-white transition"
                >
                  <Icon size={18} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Columns */}
        {settings?.footer?.columns?.map((column) => (
          <div key={column.title} className="space-y-3">
            <h4 className="font-semibold text-white">{column.title}</h4>

            <ul className="space-y-2 text-sm text-purple-200">
              {column.links?.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}

      <div className="border-t border-purple-500/30 py-5 text-sm text-purple-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <span>{settings?.footer?.copyright}</span>

          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
