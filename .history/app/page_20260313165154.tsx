import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import WhyChoose from "@/components/home/WhyChoose";

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
      },
      whyChooseTitle,
      whyChooseUs[]{
        title,
        description,
        icon{
          asset->{
            url
          }
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

        <div className="absolute inset-0 bg-black/40"></div>

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
              className="bg-white text-black px-7 py-3 rounded-lg font-semibold shadow hover:bg-gray-200 transition"
            >
              Get a Quote
            </Link>

            <Link
              href="/vehicle-transport"
              className="border border-white px-7 py-3 rounded-lg hover:bg-white hover:text-black transition"
            >
              View Routes
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE MAKATU */}

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            {homepage?.whyChooseTitle}
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {homepage?.whyChooseUs?.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow text-center"
              >
                {item.icon?.asset?.url && (
                  <Image
                    src={item.icon.asset.url}
                    alt={item.title || ""}
                    width={50}
                    height={50}
                    className="mx-auto mb-4"
                  />
                )}

                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>

                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
