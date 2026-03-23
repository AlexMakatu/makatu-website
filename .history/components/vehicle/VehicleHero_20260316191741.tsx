import Image from "next/image";
import Link from "next/link";

export default function VehicleHero() {
  return (
    <section className="relative bg-gray-50 overflow-hidden pt-28 pb-36">
      {/* RIGHT IMAGE */}
      <div className="absolute inset-y-0 right-0 w-[60%]">
        <Image
          src="/truck.jpg"
          alt="Vehicle transport truck"
          fill
          className="object-cover object-right"
          priority
        />
      </div>

      {/* LEFT GRADIENT FADE */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/95 to-transparent" />

      {/* CONTENT */}
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-xl">
          <h1 className="text-6xl font-bold leading-tight text-gray-900">
            Reliable Vehicle Transport Across South Africa
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Safe and efficient car transport between Johannesburg, Cape Town,
            Durban, and nationwide.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/get-a-quote"
              className="bg-purple-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
            >
              Get a Quote
            </Link>

            <Link
              href="#vehicle-types"
              className="border border-gray-300 px-7 py-3 rounded-lg font-semibold text-gray-900 hover:bg-gray-100 transition"
            >
              View Transport Options
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-3 text-yellow-500">
            ★★★★★
            <span className="text-gray-600 text-sm">
              Trusted by leading dealerships nationwide
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM GLOW */}
      <div className="absolute bottom-0 left-0 w-full h-40 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,200,120,0.4),transparent_70%)]" />
      </div>
    </section>
  );
}
