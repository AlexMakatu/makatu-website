import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { PortableTextBlock } from "@portabletext/types";
import { toPlainText } from "@portabletext/react";

import WhyChoose from "@/components/home/WhyChoose";
import RoutesSection from "@/components/home/RoutesSection";
import ProcessSection from "@/components/home/ProcessSection";
import Hero from "@/components/home/Hero";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import FAQSection from "@/components/home/FAQSection";
import { getReviewsQuery } from "@/sanity/queries/getReviews";
import FeaturedRoute from "@/components/home/FeaturedRoute";
import HomeRouteEstimator from "@/components/home/HomeRouteEstimator";

type Homepage = {
  pageTitle?: string;
  heroHeading?: string;
  heroText?: string;

  heroImage?: {
    asset?: {
      url?: string;
    };
    alt?: string;
  };

  seoIntro?: string;

  faqs?: {
    question?: string;
    answer?: PortableTextBlock[];
  }[];

  whyChooseTitle?: string;

  whyChooseUs?: {
    title?: string;
    description?: string;
    icon?: {
      asset?: {
        url?: string;
      };
    };
  }[];

  processTitle?: string;

  processSteps?: {
    title?: string;
    description?: string;
    icon?: {
      asset?: {
        url?: string;
      };
    };
  }[];
};

type Route = {
  slug?: { current?: string };
  routeSummary?: string;

  routeImage?: {
    asset?: {
      url?: string;
    };
  };

  fromCity?: { name?: string };
  toCity?: { name?: string };
};

type SiteSettings = {
  logo?: {
    asset?: {
      url?: string;
    };
  };

  logoIcon?: {
    asset?: {
      url?: string;
    };
  };
};

export default async function HomePage() {
  const homepage: Homepage = await client.fetch(
    groq`*[_type == "homepage"][0]{
      pageTitle,
      heroHeading,
      heroText,

      heroImage{
        asset->{url},
        alt
      },

      seoIntro,

      faqs[]->{
        question,
        answer
      },

      whyChooseTitle,
      whyChooseUs[]{
        "title": title,
        "description": description,
        "icon": icon{
          asset->{url}
        }
      },

      processTitle,
      processSteps[]{
        "title": title,
        "description": description,
        "icon": icon{
          asset->{url}
        }
      }
    }`,
    {},
    { cache: "no-store" },
  );
  const featuredRoutes: Route[] = await client.fetch(
    groq`*[_type == "route" && featuredRoute == true][0...1]{
    slug,
    fromCity->{name},
    toCity->{name}
  }`,
  );
  const routes: Route[] = await client.fetch(
    groq`*[_type == "route"]{
    slug,
    routeSummary,
    routeImage{
      asset->{url}
    },
    fromCity->{ name },
    toCity->{ name },

    "lowestPrice": *[
      _type == "routeRate" &&
      fromCity._ref == ^.fromCity._ref &&
      toCity._ref == ^.toCity._ref
    ] | order(price asc)[0].price
  }`,
  );

  const settings: SiteSettings = await client.fetch(
    groq`*[_type == "siteSettings"][0]{
      logo{
        asset->{url}
      },
      logoIcon{
        asset->{url}
      }
    }`,
  );

  /* ================= NEW: FETCH REVIEWS ================= */

  const reviews = await client.fetch(getReviewsQuery);

  /* -------------------------------
     FAQ STRUCTURED DATA (AI SEO)
  -------------------------------- */

  const faqStructuredData = homepage?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: homepage.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer ? toPlainText(faq.answer) : "",
          },
        })),
      }
    : null;

  return (
    <main className="flex flex-col">
      {/* STRUCTURED DATA */}
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
      )}

      {/* HERO */}
      <Hero homepage={homepage} logo={settings?.logoIcon} />
      <FeaturedRoute routes={featuredRoutes} />

      {/* SEO INTRO */}
      {homepage?.seoIntro && (
        <section className="py-24 bg-white border-b border-gray-200 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            {/* LEFT CONTENT */}
            <div className="relative">
              {/* BIG BACKGROUND WORD */}
              <span className="absolute top-0 left-0 -translate-y-1/3 text-[90px] md:text-[140px] font-extrabold text-gray-200/60 leading-none pointer-events-none select-none">
                NATIONWIDE
              </span>

              <h2 className="relative text-3xl md:text-4xl font-bold mb-6">
                Vehicle Transport Services
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {homepage.seoIntro}
              </p>

              <div className="space-y-3 text-gray-700">
                <div>• Nationwide coverage across South Africa</div>
                <div>• Door-to-door and depot delivery</div>
                <div>• Secure and scheduled transport</div>
              </div>
            </div>

            {/* RIGHT VISUAL */}
            <div className="relative">
              <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg p-4">
                <img
                  src="/images/south-africa-routes.png"
                  alt="Vehicle transport coverage across South Africa"
                  className="w-full h-[320px] object-contain"
                />
              </div>

              {/* FLOATING BADGE */}
              <div className="absolute -bottom-6 -left-6 bg-[#311d60] text-white px-6 py-4 rounded-xl shadow-xl">
                Nationwide Service
              </div>
            </div>
          </div>
        </section>
      )}
      {/* WHY CHOOSE */}
      <div>
        <WhyChoose
          title={homepage?.whyChooseTitle}
          features={homepage?.whyChooseUs}
        />
      </div>

      {/* ROUTES */}
      <div>
        <RoutesSection routes={routes} />
      </div>

      {/* PROCESS */}
      <div>
        <ProcessSection
          title={homepage?.processTitle}
          steps={homepage?.processSteps}
        />
      </div>

      {/* FAQ */}
      <FAQSection
        faqs={homepage?.faqs?.filter(
          (
            faq,
          ): faq is {
            question: string;
            answer: PortableTextBlock[];
          } => !!faq.question && !!faq.answer,
        )}
      />

      {/* REVIEWS */}
      <ReviewsSection />
    </main>
  );
}
