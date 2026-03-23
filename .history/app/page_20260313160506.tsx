import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      {/* Hero Section */}

      <section className="text-center mb-20">
        <h1 className="text-5xl font-bold mb-6">
          Nationwide Vehicle Transport Across South Africa
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Door-to-door vehicle transport for private owners, dealerships, and
          fleet operators. Secure car-carrier transport between major South
          African cities.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            href="/contact"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-90"
          >
            Get a Quote
          </Link>

          <Link
            href="/vehicle-transport"
            className="border px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
          >
            View Major Routes
          </Link>
        </div>
      </section>

      {/* Service Overview */}

      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-6">
          Professional Vehicle Transport Service
        </h2>

        <p className="text-gray-600 leading-relaxed">
          Makatu provides professional vehicle transport services across South
          Africa. We operate structured car-carrier routes between Johannesburg,
          Cape Town, Durban, Pretoria and Gqeberha. Our service supports private
          owners, dealerships and enterprise fleets with scheduled nationwide
          vehicle transport.
        </p>
      </section>
    </main>
  );
}
