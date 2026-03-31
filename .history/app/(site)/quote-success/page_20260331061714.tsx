import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quote Request Received | Makatu",
  description: "Your vehicle transport quote request has been received.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function QuoteSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-10 text-center">
        {/* ICON */}
        <div className="mb-6 text-green-500 text-4xl">✓</div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-4">Quote Request Received</h1>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-6">
          Thank you for your request. Our transport team will review your
          details and contact you shortly with a quote.
        </p>

        {/* TRUST BOOST */}
        <p className="text-sm text-gray-500 mb-8">
          Typical response time: within 1–2 hours
        </p>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/get-a-quote"
            className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Submit Another Request
          </Link>

          <Link
            href="/"
            className="px-6 py-3 rounded-lg bg-[#311d60] text-white font-semibold hover:opacity-90 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
