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
      {/* ================= HEADER ================= */}
      <Header />

      {/* ================= MAIN ================= */}
      <main>{children}</main>

      {/* ================= FOOTER ================= */}
      <Footer />
      {/* ================= GOOGLE ANALYTICS ================= */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-9840CM3B99"
        strategy="afterInteractive"
      />

      <Script id="ga-script" strategy="afterInteractive">
        {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-9840CM3B99', {
      page_path: window.location.pathname,
    });
  `}
      </Script>
      {/* ================= GLOBAL SEO STRUCTURED DATA ================= */}
      <Script
        id="global-structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "Makatu Business Enterprises (Pty) Ltd",
              url: "https://makatu.co.za",
              logo: "https://makatu.co.za/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+27 87 265 1140",
                contactType: "customer service",
                areaServed: "ZA",
              },
              sameAs: [
                "https://www.facebook.com/",
                "https://www.linkedin.com/",
                "https://www.instagram.com/",
                `https://wa.me/${whatsappNumber}`,
              ],
              knowsAbout: [
                "Car transport South Africa",
                "Vehicle transport Johannesburg",
                "Car shipping Cape Town",
                "Auto transport Durban",
                "Vehicle delivery South Africa",
              ],
            },
            {
              "@type": "LocalBusiness",
              name: "Makatu Vehicle Transport",
              image: "https://makatu.co.za/og-image.jpg",
              url: "https://makatu.co.za",
              telephone: "+27 87 265 1140",
              email: "info@makatu.co.za",
              address: {
                "@type": "PostalAddress",
                streetAddress: "12 Labri Petrus, Moreleta Park",
                addressLocality: "Pretoria",
                postalCode: "0044",
                addressCountry: "ZA",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "-25.8245",
                longitude: "28.2950",
              },
              areaServed: {
                "@type": "Country",
                name: "South Africa",
              },
            },
            {
              "@type": "Service",
              name: "Vehicle Transport South Africa",
              provider: {
                "@type": "Organization",
                name: "Makatu Business Enterprises (Pty) Ltd",
              },
              areaServed: {
                "@type": "Country",
                name: "South Africa",
              },
            },
            {
              "@type": "WebSite",
              name: "Makatu Vehicle Transport",
              url: "https://makatu.co.za",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://makatu.co.za/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
          ],
        })}
      </Script>

      {/* ================= GLOBAL BREADCRUMB ================= */}

      {/* ================= WHATSAPP WIDGET ================= */}
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
      <Script id="zoho-salesiq" strategy="afterInteractive">
        {`
    var $zoho=$zoho || {};
    $zoho.salesiq = $zoho.salesiq || {
      widgetcode: "YOUR_WIDGET_CODE_HERE",
      values:{},
      ready:function(){
        $zoho.salesiq.floatwindow.visible("hide");
      }
    };
    var d=document;
    var s=d.createElement("script");
    s.type="text/javascript";
    s.defer=true;
    s.src="https://salesiq.zoho.com/widget";
    var t=d.getElementsByTagName("script")[0];
    t.parentNode.insertBefore(s,t);
  `}
      </Script>
    </div>
  );
}
