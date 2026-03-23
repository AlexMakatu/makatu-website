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
  background?: string;
};

export default function VehicleHero({
  heading,
  text,
  image,
  background = "bg-white",
}: Props) {
  return (
    <section className={`${background} py-24`}>
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <div>
          {heading && (
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{heading}</h1>
          )}

          {text && <p className="text-lg text-gray-600 mb-8">{text}</p>}

          <a
            href="/get-a-quote"
            className="inline-block bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Get a Quote
          </a>
        </div>

        {/* RIGHT IMAGE */}
        {image?.asset?.url && (
          <div className="relative w-full h-[420px]">
            <Image
              src={image.asset.url}
              alt={image.alt || "Vehicle transport service"}
              fill
              priority
              className="object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
}
