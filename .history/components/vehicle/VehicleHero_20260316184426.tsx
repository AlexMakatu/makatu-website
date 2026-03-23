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
    <section className={`${background} py-24`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
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
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/get-a-quote"
                className="inline-flex justify-center items-center bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
              >
                Get a Quote
              </Link>

              <Link
                href="#vehicle-types"
                className="inline-flex justify-center items-center border border-gray-300 px-6 py-3 rounded-lg font-semibold text-gray-900 hover:bg-gray-100 transition"
              >
                View Transport Options
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={image?.alt || "Vehicle transport service"}
                width={1200}
                height={800}
                priority
                className="rounded-xl shadow-lg object-cover w-full h-auto"
              />
            ) : (
              <div className="flex items-center justify-center h-[420px] bg-gray-200 rounded-xl text-gray-500">
                Hero image missing
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
