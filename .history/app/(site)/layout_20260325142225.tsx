import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { League_Spartan } from "next/font/google";
import Script from "next/script";

import { client } from "@/sanity/lib/client";
import { contactSettingsQuery } from "@/sanity/queries/getContactSettings";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
});

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contact = await client.fetch(contactSettingsQuery);
  const whatsappNumber = contact?.whatsappNumber || "27833441849";

  return (
    <div className={leagueSpartan.className}>
      <Header />

      <main>{children}</main>

      <Footer />

      {/* WhatsApp Widget (ONLY on site pages, not /studio) */}
      <Script id="whatsapp-widget" strategy="afterInteractive">
        {`
          (function () {
            var options = {
              whatsapp: "${whatsappNumber}",
              call_to_action: "Chat with us",
              position: "right",
              pre_filled_message: "Hi Makatu, I need a vehicle transport quote."
            };

            var proto = document.location.protocol;
            var host = "getbutton.io";
            var url = proto + "//static." + host;

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
    </div>
  );
}
