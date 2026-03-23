import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Makatu Vehicle Transport",
  description: "Nationwide vehicle transport services across South Africa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {/* Header */}

        <header className="bg-[#311d60] text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-semibold tracking-wide hover:opacity-90 transition"
            >
              Makatu
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-8 text-sm font-medium">
              <Link href="/" className="hover:text-purple-200 transition">
                Home
              </Link>

              <Link
                href="/vehicle-transport"
                className="hover:text-purple-200 transition"
              >
                Vehicle Transport
              </Link>

              <Link
                href="/contact"
                className="hover:text-purple-200 transition"
              >
                Contact
              </Link>

              {/* Portal Button */}
              <Link
                href="/portal"
                className="ml-4 bg-white text-[#311d60] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition shadow-sm"
              >
                Portal Login
              </Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}

        <main>{children}</main>

        {/* Footer */}

        {/* Footer */}

        <footer className="border-t mt-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-gray-500 flex justify-between">
            <span>
              © {new Date().getFullYear()} Makatu. All rights reserved.
            </span>
            <span>Nationwide Vehicle Transport</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
