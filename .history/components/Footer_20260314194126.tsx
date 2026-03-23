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
    <footer className="relative mt-32 overflow-hidden bg-[linear-gradient(180deg,#341f68_0%,#2a1754_55%,#22123f_100%)] text-white">
      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />

      <div className="relative">
        {/* CTA */}
        <div className="mx-auto max-w-6xl px-6 -mt-16">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.08] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur md:p-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-200/80">
                Nationwide Vehicle Transport
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Need to move a vehicle?
              </h2>

              <p className="mt-3 text-sm leading-6 text-purple-100/80 md:text-base">
                Get a fast nationwide transport quote with a cleaner, simpler
                booking experience.
              </p>

              <div className="mt-6 flex justify-center">
                <Link
                  href="/get-a-quote"
                  className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#2a1754] transition hover:scale-[1.02] hover:bg-purple-50"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid gap-12 md:grid-cols-[1.25fr_0.8fr_0.8fr]">
            {/* Brand */}
            <div>
              {settings?.logo?.asset?.url ? (
                <Image
                  src={settings.logo.asset.url}
                  alt={settings.siteTitle || "Makatu"}
                  width={140}
                  height={72}
                  className="h-auto w-auto opacity-95"
                />
              ) : (
                <div className="text-2xl font-semibold tracking-wide">
                  {settings.siteTitle || "Makatu"}
                </div>
              )}

              <p className="mt-5 max-w-md text-sm leading-7 text-purple-100/80">
                {settings?.footer?.description ||
                  "Reliable nationwide vehicle transport across South Africa, delivering cars safely and efficiently."}
              </p>

              {settings?.socialLinks?.length ? (
                <div className="mt-6 flex items-center gap-3">
                  {settings.socialLinks.map((social) => {
                    const Icon = socialIconMap[social.platform.toLowerCase()];
                    if (!Icon) return null;

                    return (
                      <Link
                        key={social.url}
                        href={social.url}
                        target="_blank"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-purple-100/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                        aria-label={social.platform}
                      >
                        <Icon size={17} />
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* Columns */}
            {settings?.footer?.columns?.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold tracking-wide text-white">
                  {column.title}
                </h3>

                <ul className="mt-5 space-y-3">
                  {column.links?.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-purple-100/75 transition hover:translate-x-0.5 hover:text-white"
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

        {/* Bottom */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 text-xs text-purple-100/65 md:flex-row md:items-center md:justify-between">
            <span>
              {settings?.footer?.copyright ||
                `© ${new Date().getFullYear()} ${settings.siteTitle || "Makatu"}. All rights reserved.`}
            </span>

            <div className="flex items-center gap-5">
              <Link
                href="/privacy-policy"
                className="transition hover:text-white"
              >
                Privacy
              </Link>
              <Link href="/terms" className="transition hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
