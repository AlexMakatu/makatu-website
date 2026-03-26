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

  const routes: Route[] = await client.fetch(
    groq`*[_type == "route" && featuredRoute == true][0..5]{
      slug,
      routeSummary,
      routeImage{
        asset->{url}
      },
      fromCity->{name},
      toCity->{name}
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
      <FeaturedRoute routes={routes} />
      <div className="flex justify-center">
        <div className="w-24 h-[2px] bg-gray-300 my-6 rounded-full" />
      </div>
      {/* SEO INTRO */}
      {homepage?.seoIntro && (
        <section className="py-24 bg-white border-t border-gray-200 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6">
            {/* HEADING BLOCK */}
            <div className="relative mb-10">
              {/* BACKGROUND WORD */}
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[90px] md:text-[160px] font-extrabold text-#311d60-400 opacity-20 leading-none pointer-events-none select-none">
                NATIONWIDE
              </span>

              {/* FOREGROUND TITLE */}
              <h2 className="relative text-3xl md:text-4xl font-bold">
                Vehicle Transport Services
              </h2>
            </div>

            {/* CONTENT */}
            <div className="max-w-3xl">
              <p className="text-gray-600 text-lg leading-relaxed">
                {homepage.seoIntro}
              </p>
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
