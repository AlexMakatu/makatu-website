"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("cookie_consent");
  });

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 z-[9999]"
        >
          <div className="max-w-sm w-full rounded-2xl shadow-2xl bg-white/90 backdrop-blur-lg border border-gray-200 p-5">
            <p className="text-sm text-gray-700 mb-4">
              We use cookies to improve your experience.
            </p>

            <div className="flex gap-2 justify-end">
              <button
                onClick={decline}
                className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Decline
              </button>

              <button
                onClick={accept}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
