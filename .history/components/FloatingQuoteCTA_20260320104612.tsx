"use client";

import Link from "next/link";

type Props = {
  fromCity?: string;
  toCity?: string;
};

export default function FloatingQuoteCTA({ fromCity, toCity }: Props) {
  if (!fromCity || !toCity) return null;

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <Link
          href={`/get-a-quote?fromCity=${encodeURIComponent(
            fromCity,
          )}&toCity=${encodeURIComponent(toCity)}`}
          className="bg-[#311d60] text-white px-5 py-3 rounded-full shadow-lg font-semibold hover:scale-105 transition"
        >
          Get a Quote
        </Link>
      </div>

      {/* Mobile sticky bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-white border-t z-50">
        <Link
          href={`/get-a-quote?fromCity=${encodeURIComponent(
            fromCity,
          )}&toCity=${encodeURIComponent(toCity)}`}
          className="block w-full text-center bg-[#311d60] text-white py-3 rounded-lg font-semibold"
        >
          Get a Quote
        </Link>
      </div>
    </>
  );
}
