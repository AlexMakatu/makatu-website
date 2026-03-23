import Image from "next/image";
import Link from "next/link";

type City = {
  name?: string;
};

type SanityImage = {
  asset?: {
    url?: string;
  };
  alt?: string;
};

type Props = {
  routeImage?: SanityImage;
  heroText?: string;
  fromCity?: City;
  toCity?: City;
  startingPrice?: number; // 🔥 ADD THIS
};

export default function RouteHero({
  routeImage,
  heroText,
  fromCity,
  toCity,
  startingPrice,
}: Props) {
  const from = fromCity?.name ?? "";
  const to = toCity?.name ?? "";

  const quoteUrl = `/get-a-quote?fromCity=${encodeURIComponent(
    from,
  )}&toCity=${encodeURIComponent(to)}`;

  return (
    <section className="relative min-h-[65vh] flex items-center justify-center text-white text-center">
      {/* Background Image */}
      {routeImage?.asset?.url && (
        <Image
          src={routeImage.asset.url}
          alt={routeImage?.alt || `${from} to ${to} vehicle transport route`}
          fill
          priority
          className="object-cover"
        />
      )}

      {/* 🔥 Softer overlay (less dull) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          {from} → {to} Vehicle Transport
        </h1>

        {/* 🔥 Price anchor */}
        {startingPrice && (
          <p className="text-xl md:text-2xl font-semibold text-white/90 mb-2">
            From R{startingPrice} • Fast & Secure Delivery
          </p>
        )}

        {/* Description */}
        {heroText && (
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {heroText}
          </p>
        )}

        {/* 🔥 PRIMARY CTA */}
        <Link
          href={quoteUrl}
          className="inline-block bg-[#311d60] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:scale-105 transition"
        >
          Get Instant Quote
        </Link>
      </div>
    </section>
  );
}
