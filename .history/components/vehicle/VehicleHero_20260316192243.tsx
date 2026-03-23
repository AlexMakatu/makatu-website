import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

type HeroImage = {
  asset?: {
    _ref?: string;
    _type?: string;
  };
  alt?: string | null;
};

type Props = {
  heading?: string;
  text?: string;
  image?: HeroImage;
};

export default function VehicleHero({ heading, text, image }: Props) {
  const imageUrl = image ? urlFor(image).url() : null;

  return (
    <section className="relative overflow-hidden bg-gray-50 pt-28 pb-36">
      {/* RIGHT HERO IMAGE */}
      {imageUrl && (
        <div className="absolute inset-y-0 right-0 w-[60%] z-0">
          <Image
            src={imageUrl}
            alt={image?.alt ?? "Vehicle transport truck"}
            fill
            priority
            className="object-cover object-right"
          />
        </div>
      )}

      {/* LEFT GRADIENT FADE */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/95 to-transparent z-10" />

      {/* CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-6">
        <div className="max-w-xl">
          {heading && (
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              {heading}
            </h1>
          )}

          {text && (
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">{text}</p>
          )}

          {/* BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/get-a-quote"
              className="bg-purple-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-purple-800 transition shadow"
            >
              Get a Quote
            </Link>

            <Link
              href="#vehicle-types"
              className="border border-gray-300 px-7 py-3 rounded-lg font-semibold text-gray-900 hover:bg-gray-100 transition"
            >
              View Transport Options
            </Link>
          </div>

          {/* TRUST STARS */}
          <div className="mt-10 flex items-center gap-3">
            <div className="text-yellow-500 text-lg">★★★★★</div>

            <span className="text-gray-600 text-sm">
              Trusted by leading dealerships nationwide
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM GLOW */}
      <div className="absolute bottom-0 left-0 w-full h-40 pointer-events-none z-10">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,200,120,0.4),transparent_70%)]" />
      </div>
    </section>
  );
}
