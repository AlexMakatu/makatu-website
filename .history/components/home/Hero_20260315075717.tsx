"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
};

export default function Hero({ homepage }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#311d60] text-white">
      {/* Background Image */}
      {homepage?.heroImage?.asset?.url && (
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={homepage.heroImage.asset.url}
            alt="Vehicle transport"
            fill
            priority
            className="object-cover opacity-35"
          />
        </motion.div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#311d60] via-[#311d60]/90 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center">
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

        <div />
      </div>
    </section>
  );
}
