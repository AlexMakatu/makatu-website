import Image from "next/image";

type City = {
  name?: string;
};

type SanityImage = {
  asset?: {
    url?: string;
  };
};

type Props = {
  routeImage?: SanityImage;
  heroText?: string;
  fromCity?: City;
  toCity?: City;
};

export default function RouteHero({
  routeImage,
  heroText,
  fromCity,
  toCity,
}: Props) {
  const from = fromCity?.name ?? "";
  const to = toCity?.name ?? "";

  return (
    <section className="relative min-h-[55vh] flex items-center justify-center text-white text-center">
      {routeImage?.asset?.url && (
        <Image
          src={routeImage.asset.url}
          alt={
            routeImage?.alt ||
            `${fromCity} to ${toCity} vehicle transport route`
          }
          fill
          priority
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {from} → {to} Vehicle Transport
        </h1>

        {heroText && (
          <p className="text-lg md:text-xl text-white/90">{heroText}</p>
        )}
      </div>
    </section>
  );
}
