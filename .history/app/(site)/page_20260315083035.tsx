import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import WhyChoose from "@/components/home/WhyChoose";
import RoutesSection from "@/components/home/RoutesSection";
import ProcessSection from "@/components/home/ProcessSection";
import Hero from "@/components/home/Hero";

type Homepage = {
  pageTitle?: string;
  heroHeading?: string;
  heroText?: string;
  heroImage?: {
    asset: {
      url: string;
    };
  };

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
    asset?: { url?: string };
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
};

export default async function HomePage() {
  const homepage: Homepage = await client.fetch(
    groq`*[_type == "homepage"][0]{
      pageTitle,
      heroHeading,
      heroText,
      heroImage{
        asset->{url}
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

  /* FETCH SITE SETTINGS (LOGO) */

  const settings: SiteSettings = await client.fetch(
    groq`*[_type == "siteSettings"][0]{
      logo{
        asset->{url}
      }
    }`,
  );

  return (
    <main>
      {/* HERO */}
      <Hero homepage={homepage} logo={settings?.logo} />

      {/* WHY CHOOSE MAKATU */}
      <WhyChoose
        title={homepage?.whyChooseTitle}
        features={homepage?.whyChooseUs}
      />

      {/* ROUTES */}
      <RoutesSection routes={routes} />

      {/* PROCESS */}
      <ProcessSection
        title={homepage?.processTitle}
        steps={homepage?.processSteps}
      />
    </main>
  );
}
