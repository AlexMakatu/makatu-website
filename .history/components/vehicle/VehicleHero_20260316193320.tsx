import Image from "next/image";

type HeroImage = {
  asset?: {
    url: string;
  };
  alt?: string;
};

type Props = {
  heading?: string;
  text?: string;
  image?: HeroImage;
};

export default function VehicleHero({ heading, text, image }: Props) {
  return (
    <section className="relative overflow-hidden bg-gray-50 pt-28 pb-40">
      {/* RIGHT HERO IMAGE */}
      {image?.asset?.url && (
        <div className="absolute inset-y-0 right-0 w-[55%] z-0">
          <Image
            src={image.asset.url}
            alt={image.alt || "Vehicle transport truck"}
            fill
            priority
            className="object-contain object-right"
          />
        </div>
      )}

      {/* LEFT FADE */}
      <div className="absolute left-0 top-0 bottom-0 w-[55%] bg-gradient-to-r from-gray-50 via-gray-50/60 to-transparent z-10" />

      {/* CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-6">
        <div className="max-w-xl">
          {heading && (
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              {heading}
            </h1>
          )}

          {text && <p className="mt-6 text-lg text-gray-600">{text}</p>}

          <div className="mt-8 flex gap-4">
            <a
              href="/get-a-quote"
              className="bg-purple-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
            >
              Get a Quote
            </a>

            <a
              href="#vehicle-types"
              className="border border-gray-300 px-7 py-3 rounded-lg font-semibold text-gray-900 hover:bg-gray-100 transition"
            >
              View Transport Options
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3 text-yellow-500">
            ★★★★★
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
