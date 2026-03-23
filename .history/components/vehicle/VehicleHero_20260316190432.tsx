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
    <section className="relative bg-gray-50 overflow-hidden pt-24 pb-32">
      {/* BACKGROUND TRUCK IMAGE */}
      {imageUrl && (
        <div className="absolute inset-0 flex justify-end pointer-events-none">
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-contain object-right"
            priority
          />
        </div>
      )}

      {/* LEFT FADE OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/90 to-transparent" />

      {/* CONTENT */}
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-xl">
          {heading && (
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              {heading}
            </h1>
          )}

          {text && <p className="mt-6 text-lg text-gray-600">{text}</p>}

          {/* BUTTONS */}
          <div className="mt-8 flex gap-4">
            <Link
              href="/get-a-quote"
              className="bg-purple-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
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

          {/* STARS */}
          <div className="mt-10 flex items-center gap-3 text-yellow-500">
            ★★★★★
            <span className="text-gray-600 text-sm">
              Trusted by leading dealerships nationwide
            </span>
          </div>
        </div>
      </div>

      {/* GLOW CURVE */}
      <div className="absolute bottom-0 left-0 w-full h-48 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,200,120,0.6),transparent_70%)]" />
      </div>
    </section>
  );
}
