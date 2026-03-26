import Link from "next/link";

type Route = {
  slug?: { current?: string };
  fromCity?: { name?: string };
  toCity?: { name?: string };

  lowestPrice?: number;
  priceType?: string;
};

type Props = {
  route?: Route;
};

function formatPrice(price?: number, type?: string) {
  if (!price && type !== "quoteRequired") return null;

  if (type === "quoteRequired") return "Get a quote";
  if (type === "negotiable") return "Price negotiable";

  if (type === "startingFrom") {
    return `From R${price?.toLocaleString()}`;
  }

  return `R${price?.toLocaleString()}`;
}

export default function FeaturedRoute({ route }: Props) {
  if (!route) return null;

  const from = route.fromCity?.name || "";
  const to = route.toCity?.name || "";

  const priceLabel = formatPrice(route.lowestPrice, route.priceType);

  return (
    <section className="py-20 sm:py-24 bg-brand/5 border-b border-brand/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADING */}
        <div className="relative mb-10 text-center">
          {/* BACKGROUND WORD */}
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
            text-[50px] sm:text-[80px] md:text-[150px] 
            font-extrabold text-brand/10 leading-none 
            pointer-events-none select-none whitespace-nowrap"
          >
            TRANSPORT
          </span>

          {/* TITLE */}
          <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {from} to {to} Vehicle Transport
          </h2>

          {/* PRICE */}
          {priceLabel && (
            <p className="mt-3 text-brand font-semibold text-lg sm:text-xl">
              {priceLabel}
            </p>
          )}
        </div>

        {/* CONTENT */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Makatu specialises in vehicle transport between {from} and {to}, one
            of the busiest long-distance routes in South Africa. Whether you
            need to move a car from {from} to {to} or from {to} to {from}, we
            provide reliable, scheduled delivery with safe and efficient
            transport.
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center mb-10">
          <Link
            href={`/vehicle-transport/${route.slug?.current}`}
            className="w-full sm:w-auto text-center px-6 py-4 bg-brand text-white rounded-xl hover:bg-brand/90 transition"
          >
            {from} to {to} vehicle transport
          </Link>
        </div>

        {/* DIVIDER */}
        <div className="flex justify-center">
          <div className="w-16 h-[1px] bg-brand/20" />
        </div>
      </div>
    </section>
  );
}
