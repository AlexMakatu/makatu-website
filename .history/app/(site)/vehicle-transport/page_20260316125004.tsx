import Link from "next/link";
import ProcessSection from "@/components/home/ProcessSection";

export default function VehicleTransportPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* HERO */}

      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Vehicle Transport Across South Africa
        </h1>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Makatu provides reliable nationwide vehicle transport services
          connecting major cities across South Africa. Our professional vehicle
          carriers safely move cars, SUVs, bakkies and fleet vehicles between
          Johannesburg, Cape Town, Durban and other key locations.
        </p>
      </section>

      {/* INTRO */}

      <section className="max-w-4xl mx-auto mb-20">
        <h2 className="text-2xl font-semibold mb-6">
          Nationwide Vehicle Transport Services
        </h2>

        <p className="text-gray-700 leading-relaxed mb-6">
          Transporting a vehicle across South Africa often involves long
          distances, travel time and unnecessary mileage. Professional vehicle
          transport services solve this challenge by safely moving vehicles
          between cities using specialised vehicle carriers.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          Makatu provides vehicle transport solutions for private vehicle
          owners, dealerships, relocation companies, fleet operators and
          businesses that require dependable vehicle delivery across the
          country.
        </p>

        <p className="text-gray-700 leading-relaxed">
          Whether you are relocating, buying a car in another city, moving
          dealership inventory or transporting fleet vehicles, Makatu provides a
          reliable and efficient transport solution designed to protect your
          vehicle and simplify long-distance logistics.
        </p>
      </section>

      {/* VEHICLE TYPES */}

      <section className="mb-20">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Vehicle Types We Transport
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Passenger Cars</h3>
            <p className="text-gray-600">
              Hatchbacks, sedans and everyday vehicles transported safely
              between cities.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-2">SUVs and Bakkies</h3>
            <p className="text-gray-600">
              Larger vehicles including SUVs and double cab bakkies are securely
              transported using specialised carriers.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Dealership Vehicles</h3>
            <p className="text-gray-600">
              Dealerships regularly transport vehicles between branches or
              deliver vehicles to customers in different cities.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Auction Vehicles</h3>
            <p className="text-gray-600">
              Auction buyers rely on vehicle transport services to move newly
              purchased vehicles safely from auction locations.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Fleet Vehicles</h3>
            <p className="text-gray-600">
              Businesses and fleet operators use vehicle transport to relocate
              vehicles between operational locations.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Relocation Vehicles</h3>
            <p className="text-gray-600">
              Individuals relocating between cities can transport their vehicle
              without adding long-distance mileage.
            </p>
          </div>
        </div>
      </section>

      {/* WHO USES MAKATU */}

      <section className="mb-20">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Who Uses Makatu Vehicle Transport
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Private Vehicle Owners</h3>
            <p className="text-gray-600">
              Ideal for individuals relocating or purchasing vehicles in another
              city.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Dealerships</h3>
            <p className="text-gray-600">
              Dealers move inventory between branches and deliver vehicles to
              customers nationwide.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Auction Buyers</h3>
            <p className="text-gray-600">
              Buyers purchasing vehicles through auctions rely on transport
              services to move vehicles across provinces.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Relocation Clients</h3>
            <p className="text-gray-600">
              Families and professionals relocating across South Africa often
              transport their vehicles instead of driving long distances.
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
              "Submit your pickup and delivery cities and vehicle details.",
          },
          {
            title: "Schedule Transport",
            description:
              "Our logistics team schedules your vehicle on the next available carrier.",
          },
          {
            title: "Vehicle Transport",
            description:
              "Your vehicle is safely transported between cities using a secure carrier.",
          },
          {
            title: "Delivery",
            description:
              "Your vehicle is delivered to the destination city ready for collection.",
          },
        ]}
      />

      {/* ROUTES */}

      <section className="mt-20">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Major Vehicle Transport Routes
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

      {/* PARTNERS */}

      <section className="mt-24">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Trusted By Businesses And Clients
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
          <div className="border rounded-lg p-6 bg-white font-semibold">
            Ford
          </div>

          <div className="border rounded-lg p-6 bg-white font-semibold">
            BMW
          </div>

          <div className="border rounded-lg p-6 bg-white font-semibold">
            3G Relocation
          </div>

          <div className="border rounded-lg p-6 bg-white font-semibold">
            Wise Move
          </div>

          <div className="border rounded-lg p-6 bg-white font-semibold">
            Private Clients
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="mt-24 text-center">
        <h2 className="text-2xl font-bold mb-6">
          Need a Vehicle Transport Quote?
        </h2>

        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Makatu provides secure nationwide vehicle transport across South
          Africa for individuals, dealerships and businesses.
        </p>

        <Link
          href="/contact"
          className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Request a Quote
        </Link>
      </section>
    </main>
  );
}
