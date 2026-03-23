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

const socialIconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  whatsapp: MessageCircle,
};

export default async function Footer() {
  const settings: SiteSettings = await client.fetch(siteSettingsQuery);

  return (
    <footer className="bg-[#311d60] text-white mt-20">
      {/* Main */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-16">
        {/* Brand */}
        <div className="space-y-4">
          {settings?.logo?.asset?.url && (
            <Image
              src={settings.logo.asset.url}
              alt={settings.siteTitle || "Makatu"}
              width={120}
              height={60}
            />
          )}

          <p className="text-sm text-purple-200 leading-relaxed max-w-sm">
            {settings?.footer?.description}
          </p>

          <div className="flex gap-3 pt-1">
            {settings?.socialLinks?.map((social) => {
              const Icon = socialIconMap[social.platform];
              if (!Icon) return null;

              return (
                <Link
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  className="text-purple-300 hover:text-white transition"
                >
                  <Icon size={18} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-10">
          {settings?.footer?.columns?.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold mb-3">{column.title}</h4>

              <ul className="space-y-2 text-sm text-purple-300">
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
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-500/30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center text-xs text-purple-300">
          <span>{settings?.footer?.copyright}</span>

          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
