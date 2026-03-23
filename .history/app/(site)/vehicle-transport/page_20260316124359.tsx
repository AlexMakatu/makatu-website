import Link from "next/link";
import ProcessSection from "@/components/home/ProcessSection";

export default function VehicleTransportPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* HERO */}

      <section className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Vehicle Transport Across South Africa
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Makatu provides reliable nationwide vehicle transport services across
          South Africa. Our professional vehicle carriers safely transport cars,
          SUVs, bakkies and fleet vehicles between major cities including
          Johannesburg, Cape Town and Durban.
        </p>
      </section>

      {/* WHAT IS VEHICLE TRANSPORT */}

      <section className="mb-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          What Is Vehicle Transport?
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          Vehicle transport allows cars and other vehicles to be moved safely
          between cities using specialised vehicle carriers. Instead of driving
          long distances, vehicles are securely loaded onto professional
          transport trucks and delivered to their destination.
        </p>

        <p className="text-gray-700 leading-relaxed">
          Makatu operates scheduled vehicle transport routes across South
          Africa, helping private owners, dealerships and fleet operators move
          vehicles efficiently between major locations.
        </p>
      </section>

      {/* TYPES OF VEHICLES */}

      <section className="mb-20">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Vehicles We Transport
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="font-semibold mb-2">Passenger Cars</h3>
            <p className="text-gray-600">
              Safe nationwide transport for hatchbacks, sedans and everyday
              passenger vehicles.
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <h3 className="font-semibold mb-2">SUVs and Bakkies</h3>
            <p className="text-gray-600">
              Reliable vehicle transport for larger vehicles including SUVs and
              bakkies.
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <h3 className="font-semibold mb-2">Dealership Vehicles</h3>
            <p className="text-gray-600">
              Efficient logistics solutions for dealerships moving stock between
              cities.
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <h3 className="font-semibold mb-2">Fleet Vehicles</h3>
            <p className="text-gray-600">
              Transport solutions for company fleets and commercial vehicles.
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <h3 className="font-semibold mb-2">Online Vehicle Purchases</h3>
            <p className="text-gray-600">
              Move vehicles purchased online between cities without driving
              them.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE MAKATU */}

      <section className="mb-20">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Why Choose Makatu Vehicle Transport
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="font-semibold mb-2">Nationwide Coverage</h3>
            <p className="text-gray-600">
              Transport vehicles between major cities and regions across South
              Africa.
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <h3 className="font-semibold mb-2">Secure Vehicle Carriers</h3>
            <p className="text-gray-600">
              Professional vehicle transport equipment ensures safe handling and
              delivery.
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <h3 className="font-semibold mb-2">Trusted Logistics Team</h3>
            <p className="text-gray-600">
              Experienced vehicle logistics professionals managing every
              transport.
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <h3 className="font-semibold mb-2">Door-to-Door Transport</h3>
            <p className="text-gray-600">
              Convenient vehicle collection and delivery options across major
              cities.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS */}

      <ProcessSection
        title="How Vehicle Transport Works"
        steps={[
          {
            title: "Request a Quote",
            description:
              "Submit your vehicle transport request with pickup and delivery locations.",
          },
          {
            title: "Vehicle Collection",
            description:
              "Your vehicle is safely collected and prepared for transport.",
          },
          {
            title: "Secure Transport",
            description:
              "Vehicles are transported using professional vehicle carriers.",
          },
          {
            title: "Delivery",
            description:
              "Your vehicle is delivered safely to the destination city.",
          },
        ]}
      />

      {/* POPULAR ROUTES */}

      <section className="mt-20">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Popular Vehicle Transport Routes
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/vehicle-transport/johannesburg-to-cape-town"
            className="border rounded-lg p-6 hover:shadow-md transition bg-white"
          >
            <h3 className="font-semibold text-lg">Johannesburg → Cape Town</h3>
            <p className="text-sm text-gray-500 mt-2">View route →</p>
          </Link>

          <Link
            href="/vehicle-transport/cape-town-to-durban"
            className="border rounded-lg p-6 hover:shadow-md transition bg-white"
          >
            <h3 className="font-semibold text-lg">Cape Town → Durban</h3>
            <p className="text-sm text-gray-500 mt-2">View route →</p>
          </Link>

          <Link
            href="/vehicle-transport/johannesburg-to-durban"
            className="border rounded-lg p-6 hover:shadow-md transition bg-white"
          >
            <h3 className="font-semibold text-lg">Johannesburg → Durban</h3>
            <p className="text-sm text-gray-500 mt-2">View route →</p>
          </Link>
        </div>
      </section>

      {/* CTA */}

      <section className="mt-24 text-center">
        <h2 className="text-2xl font-bold mb-6">
          Need a Vehicle Transport Quote?
        </h2>

        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Makatu provides secure nationwide vehicle transport across South
          Africa. Request a quote and our logistics team will assist with
          scheduling your vehicle shipment.
        </p>

        <Link
          href="/get-a-quote"
          className="bg-[#311d60] text-white px-10 py-4 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Get a Quote
        </Link>
      </section>
    </main>
  );
}
