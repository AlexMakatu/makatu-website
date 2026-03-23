"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type RouteRate = {
  vehicleType: string;
  priceType: "fixed" | "startingFrom" | "negotiable" | "quoteRequired";
  price?: number;
};

type Props = {
  fromCity?: string;
  toCity?: string;
  whatsappNumber?: string;
  rates?: RouteRate[];
};

export default function FloatingCTA({
  fromCity,
  toCity,
  whatsappNumber,
  rates,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!fromCity || !toCity) return null;

  const quoteUrl = `/get-a-quote?fromCity=${encodeURIComponent(
    fromCity,
  )}&toCity=${encodeURIComponent(toCity)}`;

  const number = whatsappNumber || "27833441849";

  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(
    `Hi, I need a quote from ${fromCity} to ${toCity}`,
  )}`;

  /* 🔥 NEW: get lowest price */
  const lowestPrice =
    rates
      ?.filter((r) => r.price && r.priceType !== "quoteRequired")
      .map((r) => r.price as number)
      .sort((a, b) => a - b)[0] ?? null;

  const ctaText = lowestPrice
    ? `Get Quote from R${lowestPrice} →`
    : "Get Instant Quote →";

  return (
    <>
      {/* Desktop */}
      <div
        className={`hidden md:flex flex-col items-end gap-3 fixed top-1/2 -translate-y-1/2 right-6 z-50 transition-all duration-500 ${
          visible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-10 pointer-events-none"
        }`}
      >
        {/* Label */}
        <span className="text-xs text-gray-500 mr-1">
          Get pricing in seconds
        </span>

        {/* Primary CTA */}
        <Link
          href={quoteUrl}
          className="bg-[#311d60] text-white px-7 py-4 rounded-xl shadow-2xl font-semibold text-base 
                     hover:scale-105 transition animate-pulse"
        >
          {ctaText}
        </Link>

        {/* Secondary CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          className="text-xs text-gray-500 hover:text-gray-800 transition"
        >
          💬 Talk to an agent
        </a>
      </div>

      {/* Mobile */}
      <div
        className={`md:hidden fixed bottom-0 left-0 w-full p-4 bg-white border-t z-50 space-y-2 transition-transform duration-500 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Link
          href={quoteUrl}
          className="block w-full text-center bg-[#311d60] text-white py-3 rounded-lg font-semibold animate-pulse"
        >
          {ctaText}
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          className="block w-full text-center border py-3 rounded-lg text-gray-700 text-sm"
        >
          Talk to an Agent
        </a>
      </div>
    </>
  );
}
