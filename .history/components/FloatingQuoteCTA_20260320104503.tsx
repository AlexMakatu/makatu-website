"use client";

import Link from "next/link";

type Props = {
  fromCity?: string;
  toCity?: string;
};

export default function FloatingQuoteCTA({ fromCity, toCity }: Props) {
  if (!fromCity || !toCity) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href={`/get-a-quote?fromCity=${encodeURIComponent(
          fromCity,
        )}&toCity=${encodeURIComponent(toCity)}`}
        className="bg-[#311d60] text-white px-5 py-3 rounded-full shadow-lg font-semibold hover:scale-105 transition"
      >
        Get a Quote
      </Link>
    </div>
  );
}
