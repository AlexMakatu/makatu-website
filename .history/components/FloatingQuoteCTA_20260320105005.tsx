"use client";

import Link from "next/link";

type Props = {
  fromCity?: string;
  toCity?: string;
  whatsappNumber?: string;
};

export default function FloatingCTA({
  fromCity,
  toCity,
  whatsappNumber,
}: Props) {
  if (!fromCity || !toCity) return null;

  const quoteUrl = `/get-a-quote?fromCity=${encodeURIComponent(
    fromCity,
  )}&toCity=${encodeURIComponent(toCity)}`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi, I need a quote from ${fromCity} to ${toCity}`,
  )}`;

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex flex-col items-end gap-2 fixed bottom-6 right-6 z-50">
        <Link
          href={quoteUrl}
          className="bg-[#311d60] text-white px-6 py-3 rounded-full shadow-lg font-semibold hover:scale-105 transition"
        >
          Get a Quote
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Talk to an agent →
        </a>
      </div>

      {/* Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-white border-t z-50 space-y-2">
        <Link
          href={quoteUrl}
          className="block w-full text-center bg-[#311d60] text-white py-3 rounded-lg font-semibold"
        >
          Get a Quote
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          className="block w-full text-center border py-3 rounded-lg text-gray-700"
        >
          Talk to an Agent
        </a>
      </div>
    </>
  );
}
