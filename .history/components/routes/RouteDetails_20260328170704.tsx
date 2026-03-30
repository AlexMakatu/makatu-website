import Link from "next/link";

type RouteRate = {
  vehicleType: string;
  priceType: "fixed" | "startingFrom" | "negotiable" | "quoteRequired";
  price?: number;
};

type Props = {
  transitTime?: number;
  rates?: RouteRate[];
  fromCity?: string; // ✅ NEW
  toCity?: string; // ✅ NEW
};

function formatVehicleType(value: string) {
  const labels: Record<string, string> = {
    hatchback: "Hatchback",
    sedan: "Sedan",
    suv: "SUV",
    bakkie: "Bakkie",
    van: "Van",
    luxury: "Luxury / Exotic",
  };

  return labels[value] ?? value;
}

function formatPrice(rate: RouteRate) {
  if (rate.priceType === "fixed" && rate.price) return `R${rate.price}`;
  if (rate.priceType === "startingFrom" && rate.price)
    return `From R${rate.price}`;
  if (rate.priceType === "negotiable") return "Negotiable";

  return "Quote Required";
}

export default function RouteDetails({
  transitTime,
  rates,
  fromCity,
  toCity,
}: Props) {
  if (!transitTime && (!rates || rates.length === 0)) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      {/* Transit Time */}
      {transitTime && (
        <div className="bg-gray-50 border rounded-xl p-6 text-center mb-8">
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
            Typical Transit Time
          </p>

          <p className="text-2xl font-semibold text-gray-900">
            {transitTime} Days
          </p>

          <p className="text-sm text-gray-600 mt-3 max-w-md mx-auto">
            Typically {transitTime} days from collection. Delivery times may
            extend up to 10 days depending on scheduling, vehicle availability,
            and shared transport loads.
          </p>
        </div>
      )}

      {/* Rates */}
      {rates && rates.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Estimated Transport Price
          </h2>

          <div className="border rounded-xl overflow-hidden bg-white">
            {rates.map((rate, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
              >
                <span className="font-medium text-gray-900">
                  {formatVehicleType(rate.vehicleType)}
                </span>

                <span className="text-gray-700">{formatPrice(rate)}</span>
              </div>
            ))}
          </div>

          {/* 🔥 NEW CTA */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Get your exact price and confirm availability in seconds.
            </p>

            <Link
              href={`/get-a-quote?fromCity=${encodeURIComponent(
                fromCity || "",
              )}&toCity=${encodeURIComponent(toCity || "")}`}
              className="inline-block bg-[#311d60] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Continue to Quote
            </Link>

            <p className="text-sm text-gray-500 mt-2">
              No obligation • Takes less than 30 seconds
            </p>
          </div>
        </>
      )}
    </section>
  );
}
