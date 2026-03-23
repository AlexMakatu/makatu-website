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
    <section className={`${background} py-20`}>
      <div className="max-w-6xl mx-auto px-6">
        {image?.asset?.url && (
          <div className="relative w-full h-[420px] mb-10">
            <Image
              src={image.asset.url}
              alt={image.alt || "Vehicle transport service"}
              fill
              priority
              className="object-cover rounded-lg"
            />
          </div>
        )}

        <div className="text-center max-w-3xl mx-auto">
          {heading && (
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{heading}</h1>
          )}

          {text && <p className="text-lg text-gray-600">{text}</p>}
        </div>
      </div>
    </section>
  );
}
