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
  background?: string;
};

export default function VehicleHero({
  heading,
  text,
  image,
  background = "bg-gray-50",
}: Props) {
  const imageUrl = image?.asset?.url;

  return (
    <section className={`${background} pt-24 pb-20`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="max-w-xl">
            {heading && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                {heading}
              </h1>
            )}

            {text && (
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                {text}
              </p>
            )}

            {/* CTA BUTTONS */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/get-a-quote"
                className="inline-flex items-center justify-center bg-purple-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
              >
                Get a Quote
              </Link>

              <Link
                href="#vehicle-types"
                className="inline-flex items-center justify-center border border-gray-300 px-7 py-3 rounded-lg font-semibold text-gray-900 hover:bg-gray-100 transition"
              >
                View Transport Options
              </Link>
            </div>

            {/* TRUST INDICATORS */}
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-600">
              <span>✔ Safe & Insured</span>
              <span>✔ Nationwide Transport</span>
              <span>✔ Dealer Trusted</span>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={image?.alt || "Vehicle transport truck"}
                width={1200}
                height={800}
                priority
                className="rounded-xl shadow-xl object-cover w-full h-auto"
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
