import type { Metadata } from "next";
import "./globals.css";

import { League_Spartan } from "next/font/google";
import Script from "next/script";

import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/queries/getSiteSettings";
import { contactSettingsQuery } from "@/sanity/queries/getContactSettings";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contact = await client.fetch(contactSettingsQuery);

  const whatsappNumber =
    contact?.whatsapp?.toString().replace(/\D/g, "") || "27833441849";

  return (
    <html lang="en">
      <body className={leagueSpartan.className}>
        {children}

        <Script id="whatsapp-widget" strategy="afterInteractive">
          {`
            var options = {
              whatsapp: "${whatsappNumber}",
              call_to_action: "Chat with us",
              position: "right",
              pre_filled_message: "Hi Makatu 👋 I need help with vehicle transport."
            };

            (function () {
              var proto = document.location.protocol,
                host = "getbutton.io",
                url = proto + "//static." + host;

              var s = document.createElement("script");
              s.type = "text/javascript";
              s.async = true;
              s.src = url + "/widget-send-button/js/init.js";

              s.onload = function () {
                WhWidgetSendButton.init(host, proto, options);
              };

              var x = document.getElementsByTagName("script")[0];
              x.parentNode.insertBefore(s, x);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
