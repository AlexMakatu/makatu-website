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

  // Get lowest price
  const validPrices =
    rates
      ?.filter((r) => typeof r.price === "number")
      .map((r) => r.price as number) ?? [];

  const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;

  const ctaText = lowestPrice
    ? `Get Instant Quote from R${lowestPrice}`
    : "Get Instant Quote";

  return (
    <>
      {/* Desktop */}
      <div
        className={`hidden md:flex flex-col items-end gap-2 fixed top-1/2 -translate-y-1/2 right-6 z-50 transition-all duration-500 ${
          visible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-10 pointer-events-none"
        }`}
      >
        <span className="text-xs text-gray-500 mr-1">
          Get pricing in seconds
        </span>

        <Link
          href={quoteUrl}
          className="bg-[#311d60] text-white px-7 py-4 rounded-xl shadow-xl font-semibold text-base hover:scale-105 transition"
        >
          {ctaText}
        </Link>

        {/* Secondary (less prominent) */}
        <a
          href={whatsappUrl}
          target="_blank"
          className="text-xs text-gray-500 hover:text-gray-800 transition"
        >
          Talk to an agent
        </a>
      </div>

      {/* Mobile */}
      <div
        className={`md:hidden fixed bottom-0 left-0 w-full p-4 bg-white border-t z-50 transition-transform duration-500 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* ONE PRIMARY CTA ONLY */}
        <Link
          href={quoteUrl}
          className="block w-full text-center bg-[#311d60] text-white py-4 rounded-lg font-semibold"
        >
          {ctaText}
        </Link>
      </div>

      {/* WhatsApp FLOATING (separate, not competing) */}
      <a
        href={whatsappUrl}
        target="_blank"
        className="fixed bottom-20 right-4 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg md:bottom-6"
      >
        💬
      </a>
    </>
  );
}
