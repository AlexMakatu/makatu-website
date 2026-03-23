import Image from "next/image";
import Link from "next/link";

type HeroImage = {
  asset?: {
    url?: string;
  };
  alt?: string | null;
};

type Props = {
  heading?: string;
  text?: string;
  image?: HeroImage;
};

export default function VehicleHero({ heading, text, image }: Props) {
  const imageUrl = image?.asset?.url;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-900 to-purple-700 pt-28 pb-24 text-white">
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.25),transparent_40%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="max-w-xl">
            {heading && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {heading}
              </h1>
            )}

            {text && (
              <p className="mt-6 text-lg text-purple-100 leading-relaxed">
                {text}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/get-a-quote"
                className="bg-white text-purple-700 px-7 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Get a Quote
              </Link>

              <Link
                href="#vehicle-types"
                className="border border-white/40 px-7 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                View Transport Options
              </Link>
            </div>

            {/* Rating */}
            <div className="mt-8 flex items-center gap-3 text-yellow-400">
              ★★★★★
              <span className="text-sm text-purple-100 ml-2">
                Trusted by leading dealerships nationwide
              </span>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={image?.alt || "Vehicle transport truck"}
                width={1200}
                height={800}
                priority
                className="rounded-2xl shadow-2xl object-cover w-full h-auto"
              />
            ) : (
              <div className="h-[420px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                Hero image missing
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
