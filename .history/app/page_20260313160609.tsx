import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";

type Homepage = {
  heroHeading?: string;
  heroSubheading?: string;
};

export default async function HomePage() {
  const homepage: Homepage = await client.fetch(
    groq`*[_type == "homepage"][0]{
      heroHeading,
      heroSubheading
    }`,
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      <section className="text-center mb-20">
        <h1 className="text-5xl font-bold mb-6">
          {homepage?.heroHeading || "Nationwide Vehicle Transport"}
        </h1>

        {homepage?.heroSubheading && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            {homepage.heroSubheading}
          </p>
        )}

        <div className="flex justify-center gap-6">
          <Link
            href="/contact"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium"
          >
            Get a Quote
          </Link>

          <Link
            href="/vehicle-transport"
            className="border px-6 py-3 rounded-lg font-medium"
          >
            View Major Routes
          </Link>
        </div>
      </section>
    </main>
  );
}
