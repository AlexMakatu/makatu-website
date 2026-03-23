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
  asset?: { url?: string };
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
    <footer className="bg-[#311d60] text-white mt-24">
      {/* Top Brand Section */}
      <div className="max-w-4xl mx-auto text-center px-6 py-12">
        {settings?.logo?.asset?.url && (
          <Image
            src={settings.logo.asset.url}
            alt={settings.siteTitle || "Makatu"}
            width={140}
            height={70}
            className="mx-auto"
          />
        )}

        <p className="text-purple-200 text-sm mt-4 max-w-md mx-auto">
          {settings?.footer?.description}
        </p>

        <div className="flex justify-center gap-4 mt-6">
          {settings?.socialLinks?.map((social) => {
            const Icon = socialIconMap[social.platform];
            if (!Icon) return null;

            return (
              <Link
                key={social.url}
                href={social.url}
                target="_blank"
                className="text-purple-300 hover:text-white"
              >
                <Icon size={18} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Links */}
      <div className="border-t border-purple-500/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 px-6 py-10 text-center md:text-left">
          {settings?.footer?.columns?.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold mb-3">{column.title}</h4>

              <ul className="space-y-2 text-sm text-purple-300">
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
      </div>

      {/* Bottom */}
      <div className="border-t border-purple-500/30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-purple-300 gap-3">
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
