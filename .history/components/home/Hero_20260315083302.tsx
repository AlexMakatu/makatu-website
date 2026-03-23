"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type SanityImage = {
  asset?: {
    url?: string;
  };
};

type HeroProps = {
  homepage?: {
    heroHeading?: string;
    heroText?: string;
    heroImage?: {
      asset?: {
        url?: string;
      };
    };
  };
  logo?: SanityImage;
};

export default function Hero({ homepage, logo }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#311d60] text-white min-h-[90vh] flex items-center">
      {/* Background Image */}
      {homepage?.heroImage?.asset?.url && (
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={homepage.heroImage.asset.url}
            alt="Vehicle transport"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[75%_40%] brightness-[0.7]"
          />
        </motion.div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#311d60]/80 via-[#311d60]/50 to-transparent" />

      {/* Sanity Logo Watermark */}
      {logo?.asset?.url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 1.2 }}
          className="absolute right-[10%] top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block"
        >
          <Image
            src={logo.asset.url}
            alt="Makatu"
            width={520}
            height={520}
            className="w-[520px] h-auto opacity-30 brightness-0 invert"
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-40 flex items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold leading-tight mb-6"
          >
            {homepage?.heroHeading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/90 max-w-xl mb-8"
          >
            {homepage?.heroText}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <Link
              href="/get-a-quote"
              className="bg-white text-[#311d60] px-8 py-4 rounded-lg font-semibold hover:scale-105 transition"
            >
              Get a Quote
            </Link>

            <Link
              href="/vehicle-transport"
              className="border border-white px-8 py-4 rounded-lg hover:bg-white hover:text-[#311d60] transition"
            >
              View Routes
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        onClick={() =>
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
          })
        }
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer text-white/70"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.div>
    </section>
  );
}
