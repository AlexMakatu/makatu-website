import Image from "next/image";

type Props = {
  heading?: string;
  text?: string;
  image?: {
    asset?: { url: string };
    alt?: string;
  };
};

export default function VehicleHero({ heading, text, image }: Props) {
  return (
    <section className="relative mb-20">
      {image?.asset?.url && (
        <div className="relative w-full h-[420px] mb-8">
          <Image
            src={image.asset.url}
            alt={image.alt || "Vehicle transport"}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{heading}</h1>

        <p className="text-lg text-gray-600">{text}</p>
      </div>
    </section>
  );
}
