"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

/* ================= TYPES ================= */

type HeroImage = {
  asset?: unknown;
  alt?: string;
};

type Props = {
  heading?: string;
  text?: string;
  image?: HeroImage;
  background?: string;
};

/* ================= COMPONENT ================= */

export default function VehicleHero({
  heading,
  text,
  image,
  background, // eslint-disable-line @typescript-eslint/no-unused-vars
}: Props) {
  return (
    <section className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center">
      
      {/* IMAGE */}
{image?.asset && typeof image === "object" && (
  <div className="absolute inset-0 z-0">
    <Image
      src={urlFor(image as { asset: unknown })
        .width(2000)
        .quality(90)
        .url()}
      alt={image.alt || "Vehicle transport"}
      fill
      priority
      sizes="100vw"
      className="object-cover object-center"
    />
  </div>
)}
        </div>
      )}

      {/* ✅ FIX: better overlay (not washed out) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />

      {/* CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex items-center h-full">
        <div className="max-w-xl text-white">
          
          {/* HEADING */}
          {heading && (
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight drop-shadow-md">
              {heading}
            </h1>
          )}

          {/* TEXT */}
          {text && (
            <p className="mt-6 text-lg text-white/90 leading-relaxed drop-shadow-sm">
              {text}
            </p>
          )}

          {/* BUTTONS */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/get-a-quote"
              className="bg-brand text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition"
            >
              Get a Quote
            </Link>

            <Link
              href="#vehicle-types"
              className="border border-white/40 px-8 py-4 rounded-xl font-semibold text-white hover:bg-white/10 transition"
            >
              View Transport Options
            </Link>
          </div>

          {/* TRUST */}
          <div className="mt-10 flex items-center gap-4">
            <div className="text-yellow-400 text-lg">★★★★★</div>

            <span className="text-white/80 text-sm">
              Trusted by leading dealerships nationwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}