import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative mt-32 text-white">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2f1d5a] via-[#2a184f] to-[#20123a]" />

      <div className="relative">
        {/* CTA Card */}
        <div className="max-w-6xl mx-auto px-6 -mt-24">
          <div className="bg-white text-gray-900 rounded-2xl shadow-xl p-10 text-center">
            <h2 className="text-3xl font-semibold">Need to move a vehicle?</h2>

            <p className="text-gray-600 mt-2">
              Get a fast nationwide vehicle transport quote in minutes.
            </p>

            <Link
              href="/get-a-quote"
              className="inline-block mt-6 bg-[#2f1d5a] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        {/* Main footer */}
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-16">
          {/* Brand */}
          <div>
            <div className="text-xl font-semibold tracking-wide">MAKATU</div>

            <p className="text-purple-200 mt-4 text-sm max-w-sm">
              Reliable nationwide vehicle transport across South Africa,
              delivering cars safely and efficiently.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>

            <ul className="space-y-3 text-purple-200 text-sm">
              <li>
                <Link href="/vehicle-transport" className="hover:text-white">
                  Vehicle Transport
                </Link>
              </li>

              <li>
                <Link href="/get-a-quote" className="hover:text-white">
                  Request Quote
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>

            <ul className="space-y-3 text-purple-200 text-sm">
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>

              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-purple-500/20">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between text-xs text-purple-300">
            <span>© Makatu Vehicle Transport 2026</span>

            <div className="flex gap-6 mt-3 md:mt-0">
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy
              </Link>

              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
