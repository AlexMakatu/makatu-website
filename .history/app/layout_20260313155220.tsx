import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "/globals.css";

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

        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Makatu
            </Link>

            <nav className="flex gap-6 text-sm font-medium">
              <Link href="/">Home</Link>
              <Link href="/vehicle-transport">Vehicle Transport</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}

        <main>{children}</main>

        {/* Footer */}

        <footer className="border-t mt-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-gray-500">
            © {new Date().getFullYear()} Makatu. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
