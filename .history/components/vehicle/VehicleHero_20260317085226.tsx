import Image from "next/image";
import Link from "next/link";

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
    <section className="relative bg-white min-h-[720px] flex items-center">
      {/* IMAGE */}
      {image?.asset?.url && (
        <div className="absolute inset-y-0 right-0 w-full md:w-[60%] z-0 pointer-events-none">
          <Image
            src={image.asset.url}
            alt={image.alt || "Vehicle transport truck"}
            fill
            priority
            className="object-contain object-right"
          />
        </div>
      )}

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-xl">
          {/* HEADING */}
          {heading && (
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 tracking-tight">
              {heading}
            </h1>
          )}

          {/* TEXT */}
          {text && (
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">{text}</p>
          )}

          {/* BUTTONS */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/get-a-quote"
              className="bg-[#5B3CC4] text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition"
            >
              Get a Quote
            </a>

            <Link
              href="/get-a-quote"
              className="bg-[#5B3CC4] text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition"
            >
              Get a Quote
            </Link>
          </div>

          {/* TRUST */}
          <div className="mt-10 flex items-center gap-4">
            <div className="text-yellow-500 text-lg">★★★★★</div>

            <span className="text-gray-600 text-sm">
              Trusted by leading dealerships nationwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
