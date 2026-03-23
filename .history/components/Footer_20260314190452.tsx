import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/queries/getSiteSettings";

import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

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

type SiteSettings = {
  siteTitle?: string;
  footerDescription?: string;
  footerColumns?: FooterColumn[];
  footerText?: string;
  socialLinks?: SocialLink[];
};

const socialIconMap: Record<string, React.ComponentType<any>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
};

export default async function Footer() {
  const settings: SiteSettings = await client.fetch(siteSettingsQuery);

  return (
    <footer className="bg-[#311d60] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{settings?.siteTitle}</h3>

          <p className="text-purple-200 text-sm">
            {settings?.footerDescription}
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            {settings?.socialLinks?.map((social) => {
              const Icon = socialIconMap[social.platform];
              if (!Icon) return null;

              return (
                <Link
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  className="text-purple-200 hover:text-white"
                >
                  <Icon size={20} />
                </Link>
              );
            })}
          </div>
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
