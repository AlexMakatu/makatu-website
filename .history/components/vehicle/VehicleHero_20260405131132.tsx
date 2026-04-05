"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

/* ================= TYPES ================= */

type HeroImage = {
  asset?: {
    _ref?: string;
    _type?: string;
  };
  alt?: string;
};

type Props = {
  heading?: string;
  text?: string;
  image?: HeroImage;
  background?: string;
};

/* ================= TYPE GUARD ================= */

function isSanityImage(img: unknown): img is { asset?: unknown; alt?: string } {
  return typeof img === "object" && img !== null && "asset" in img;
}

/* ================= COMPONENT ================= */

export default function VehicleHero({ heading, text, image }: Props) {
  return (
    <section className="relative w-full min-h-[60vh] md:min-h-[75vh] lg:min-h-[85vh] flex items-center">
      {/* IMAGE */}
      {isSanityImage(image) && image.asset && (
        <div className="absolute inset-0 z-0">


{imageUrl && (
  <div className="absolute inset-0 z-0">
    <Image
      src={imageUrl.width(2000).quality(90).url()}
      alt={image?.alt || "Vehicle transport"}
      fill
      priority
      sizes="100vw"
      className="object-cover object-center"
    />
  </div>
)}

      {/* OVERLAY (stronger on mobile) */}
      <div className="absolute inset-0 bg-black/60 md:bg-gradient-to-r md:from-black/60 md:via-black/20 md:to-transparent z-10" />

      {/* CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center h-full">
        <div className="w-full max-w-lg md:max-w-xl text-white">
          {/* HEADING */}
          {heading && (
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-md">
              {heading}
            </h1>
          )}

          {/* TEXT */}
          {text && (
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/90 leading-relaxed drop-shadow-sm">
              {text}
            </p>
          )}

          {/* BUTTONS */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/get-a-quote"
              className="w-full sm:w-auto text-center bg-brand text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition"
            >
              Get a Quote
            </Link>

            <Link
              href="/vehicle-transport/routes"
              className="w-full sm:w-auto text-center border border-white/40 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold text-white hover:bg-white/10 transition"
            >
              View Available Routes
            </Link>
          </div>

          {/* TRUST */}
          <div className="mt-8 sm:mt-10 flex items-center gap-3 sm:gap-4">
            <div className="text-yellow-400 text-base sm:text-lg">★★★★★</div>

            <span className="text-white/80 text-xs sm:text-sm">
              Trusted by leading dealerships nationwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
