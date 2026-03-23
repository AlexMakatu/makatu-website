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

        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}

        <div className="relative max-w-2xl px-6 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {homepage?.heroHeading}
          </h1>

          <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
            {homepage?.heroText}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
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
