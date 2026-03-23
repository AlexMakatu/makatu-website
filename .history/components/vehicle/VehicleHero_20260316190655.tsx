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
    <section className="bg-gray-50 pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT SIDE */}
        <div>
          {heading && (
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              {heading}
            </h1>
          )}

          {text && <p className="mt-6 text-lg text-gray-600">{text}</p>}

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

          <div className="mt-10 flex items-center gap-3 text-yellow-500">
            ★★★★★
            <span className="text-gray-600 text-sm">
              Trusted by leading dealerships nationwide
            </span>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        {imageUrl && (
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={image?.alt ?? "Vehicle transport truck"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}
