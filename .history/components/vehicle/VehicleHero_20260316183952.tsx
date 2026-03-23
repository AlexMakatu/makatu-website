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
  const hasImage = Boolean(image?.asset?.url);

  return (
    <section className={`${background} py-16 md:py-24`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="max-w-2xl">
            {heading && (
              <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
                {heading}
              </h1>
            )}

            {text && (
              <p className="mt-6 text-base leading-8 text-gray-600 sm:text-lg">
                {text}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/get-a-quote"
                className="inline-flex items-center justify-center rounded-lg bg-purple-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
              >
                Get a Quote
              </Link>

              <Link
                href="#vehicle-types"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                View Transport Options
              </Link>
            </div>
          </div>

          <div>
            {hasImage ? (
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={image?.asset?.url ?? ""}
                  alt={image?.alt || "Vehicle transport service"}
                  width={1200}
                  height={800}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-sm text-gray-500">
                Hero image coming soon
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
