import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

type Homepage = {
  pageTitle?: string;
  heroHeading?: string;
  heroText?: string;
  heroImage?: {
    asset: {
      url: string;
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
        asset->{
          url
        }
      }
    }`,
  );

  return (
    <main>
      {/* HERO */}

      <section className="relative min-h-[70vh] flex items-center justify-center text-center text-white">
        {homepage?.heroImage?.asset?.url && (
          <Image
            src={homepage.heroImage.asset.url}
            alt="Vehicle transport truck"
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Overlay */}

        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}

        <div className="relative max-w-4xl px-6 z-10">
          <h1 className="text-5xl font-bold mb-6">{homepage?.heroHeading}</h1>

          <p className="text-xl mb-8">{homepage?.heroText}</p>

          <div className="flex justify-center gap-6">
            <Link
              href="/contact"
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
            >
              Get a Quote
            </Link>

            <Link
              href="/vehicle-transport"
              className="border border-white px-6 py-3 rounded-lg"
            >
              View Routes
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
