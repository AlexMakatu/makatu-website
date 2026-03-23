import Link from "next/link";

export default function QuoteSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-6">Quote Request Received</h1>

      <p className="text-gray-600 mb-8">
        Thank you for your request. Our transport team will review the details
        and contact you shortly with a quote.
      </p>

      <Link
        href="/"
        className="inline-block bg-black text-white px-6 py-3 rounded-lg"
      >
        Back to Home
      </Link>
    </div>
  );
}
