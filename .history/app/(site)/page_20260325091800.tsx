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

type Homepage = {
  pageTitle?: string;
  heroHeading?: string;
  heroText?: string;

  heroImage?: {
    asset?: { url?: string };
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
      asset?: { url?: string };
    };
  }[];

  processTitle?: string;

  processSteps?: {
    title?: string;
    description?: string;
    icon?: {
      asset?: { url?: string };
    };
  }[];
};

type Route = {
  slug?: { current?: string };
  routeSummary?: string;

  routeImage?: {
    asset?: { url?: string };
  };

  fromCity?: { name?: string };
  toCity?: { name?: string };

  lowestPrice?: number; // ✅ IMPORTANT
};

type SiteSettings = {
  logo?: {
    asset?: { url?: string };
  };

  logoIcon?: {
    asset?: { url?: string };
  };
};

export default async function HomePage() {
  /* ---------------- HOMEPAGE ---------------- */

  const homepage: Homepage = await client.fetch(
    groq`*[_type == "homepage"][0]{
      pageTitle,
      heroHeading,
      heroText,
      heroImage{ asset->{url}, alt },
      seoIntro,
      faqs[]->{ question, answer },

      whyChooseTitle,
      whyChooseUs[]{
        "title": title,
        "description": description,
        "icon": icon{ asset->{url} }
      },

      processTitle,
      processSteps[]{
        "title": title,
        "description": description,
        "icon": icon{ asset->{url} }
      }
    }`,
    {},
    { cache: "no-store" },
  );

  /* ---------------- FEATURED ROUTE ---------------- */

  const featuredRoutes: Route[] = await client.fetch(
    groq`*[_type == "route" && featuredRoute == true][0...1]{
      slug,
      fromCity->{ name },
      toCity->{ name }
    }`,
    {},
    { cache: "no-store" },
  );

  /* ---------------- ROUTES (WITH PRICE) ---------------- */

  const routes: Route[] = await client.fetch(
    groq`*[_type == "route" && defined(slug.current)]
      | order(random())[0...6]{
        slug,
        routeSummary,
        routeImage{ asset->{url} },
        fromCity->{ name },
        toCity->{ name },

        "lowestPrice": *[
          _type == "routeRate" &&
          fromCity._ref == ^.fromCity._ref &&
          toCity._ref == ^.toCity._ref
        ] | order(price asc)[0].price
      }`,
    {},
    { cache: "no-store" },
  );

  /* ---------------- SETTINGS ---------------- */

  const settings: SiteSettings = await client.fetch(
    groq`*[_type == "siteSettings"][0]{
      logo{ asset->{url} },
      logoIcon{ asset->{url} }
    }`,
  );

  /* ---------------- REVIEWS ---------------- */

  const reviews = await client.fetch(getReviewsQuery);

  /* ---------------- FAQ STRUCTURED DATA ---------------- */

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

      {/* ✅ FEATURED ROUTE (FIXED) */}
      <FeaturedRoute routes={featuredRoutes} />

      {/* WHY CHOOSE */}
      <WhyChoose
        title={homepage?.whyChooseTitle}
        features={homepage?.whyChooseUs}
      />

      {/* ROUTES (WITH PRICE) */}
      <RoutesSection routes={routes} />

      {/* PROCESS */}
      <ProcessSection
        title={homepage?.processTitle}
        steps={homepage?.processSteps}
      />

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
