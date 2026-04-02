"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ServiceIntro() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-lg md:text-xl text-gray-700 leading-relaxed"
        >
          Vehicle transport across South Africa, designed to be simple,
          reliable, and stress-free.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <Link
            href="/vehicle-transport"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Explore how it works →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
