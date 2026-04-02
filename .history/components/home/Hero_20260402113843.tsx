"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import HomeRouteEstimator from "@/components/home/HomeRouteEstimator";
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
      alt?: string;
    };
  };
  logo?: SanityImage;
};

export default function Hero({ homepage, logo }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#311d60] text-white min-h-[65vh] md:min-h-[85vh] flex items-center">
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
            alt={
              homepage?.heroImage?.alt ||
              "Vehicle transport across South Africa"
            }
            fill
            priority
            sizes="100vw"
            className="object-cover object-center md:object-[75%_40%] brightness-[0.7]"
          />
        </motion.div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#311d60]/85 via-[#311d60]/60 to-transparent" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          {/* LEFT: TEXT */}
          <div className="max-w-xl text-left">
            {/* Logo */}
            {logo?.asset?.url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-3"
              >
                <Image
                  src={logo.asset.url}
                  alt="Makatu"
                  width={180}
                  height={80}
                  className="w-[110px] sm:w-[130px] md:w-[180px] h-auto"
                />
              </motion.div>
            )}

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
            >
              {homepage?.heroHeading}
            </motion.h1>

            {/* Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed"
            >
              {homepage?.heroText}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4"
            >
              <Link
                href="/vehicle-transport"
                className="text-white/80 text-sm underline underline-offset-4 hover:text-white"
              >
                Learn more about our vehicle transport →
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: ESTIMATOR */}
          <div className="w-full md:max-w-md md:ml-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white text-gray-900 rounded-2xl shadow-2xl p-5 sm:p-6 border border-white/20 backdrop-blur-sm"
            >
              <HomeRouteEstimator />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator (hide on small screens) */}
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
        className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer text-white/70"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
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
