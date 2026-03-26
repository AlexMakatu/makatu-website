import type { Metadata } from "next";
import "./globals.css";

import { League_Spartan } from "next/font/google";

import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/queries/getSiteSettings";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
});

type SiteSettings = {
  siteTitle?: string;
  siteDescription?: string;
  favicon?: {
    asset?: {
      url?: string;
    };
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const settings: SiteSettings = await client.fetch(siteSettingsQuery);

  return {
    title: settings?.siteTitle || "Makatu Vehicle Transport",
    description:
      settings?.siteDescription ||
      "Nationwide vehicle transport services across South Africa.",

    icons: {
      icon: settings?.favicon?.asset?.url || "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={leagueSpartan.className}>{children}</body>
    </html>
  );
}
