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
  rates?: RouteRate[];
};

export default function FloatingCTA({ fromCity, toCity, rates }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        // Desktop → show after scroll
        setVisible(window.scrollY > 200);
      } else {
        // Mobile → always visible
        setVisible(true);
      }
    };

    handleScroll(); // run immediately on load

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!fromCity || !toCity) return null;

  const quoteUrl = `/get-a-quote?fromCity=${encodeURIComponent(
    fromCity,
  )}&toCity=${encodeURIComponent(toCity)}`;

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
        className={`hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
          visible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-10 pointer-events-none"
        }`}
      >
        <Link
          href={quoteUrl}
          className="bg-[#311d60] text-white px-6 py-4 rounded-xl shadow-xl font-semibold text-base hover:scale-105 transition"
        >
          {ctaText}
        </Link>
      </div>

      {/* Mobile Sticky CTA */}
      <div
        className={`md:hidden fixed bottom-0 left-0 w-full p-4 bg-white border-t z-50 transition-transform duration-500 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Link
          href={quoteUrl}
          className="block w-full text-center bg-[#311d60] text-white py-4 rounded-lg font-semibold"
        >
          {ctaText}
        </Link>
      </div>
    </>
  );
}
