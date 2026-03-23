import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

import WhyChoose from "@/components/home/WhyChoose";
import RoutesSection from "@/components/home/RoutesSection";
import ProcessSection from "@/components/home/ProcessSection";
import Hero from "@/components/home/Hero";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import FAQSection from "@/components/home/FAQSection";
import { PortableTextBlock } from "sanity";
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

  return (
    <main className="flex flex-col">
      {/* HERO */}
      <Hero homepage={homepage} logo={settings?.logoIcon} />

      {/* SEO INTRO (CMS CONTROLLED) */}
      {homepage?.seoIntro && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Vehicle Transport Across South Africa
            </h2>

            <p className="text-gray-600 leading-relaxed">{homepage.seoIntro}</p>
          </div>
        </section>
      )}

      {/* WHY CHOOSE */}
      <div className="mt-8 md:mt-12">
        <WhyChoose
          title={homepage?.whyChooseTitle}
          features={homepage?.whyChooseUs}
        />
      </div>

      {/* ROUTES */}
      <div className="mt-8 md:mt-12">
        <RoutesSection routes={routes} />
      </div>

      {/* PROCESS */}
      <div className="mt-8 md:mt-12">
        <ProcessSection
          title={homepage?.processTitle}
          steps={homepage?.processSteps}
        />
      </div>
      <FAQSection faqs={homepage?.faqs} />
      {/* REVIEWS */}
      <ReviewsSection />
    </main>
  );
}
