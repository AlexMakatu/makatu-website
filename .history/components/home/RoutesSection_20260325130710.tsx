import Link from "next/link";
import Image from "next/image";

type Route = {
  slug?: {
    current?: string;
  };
  routeSummary?: string;
  routeImage?: {
    asset?: {
      url?: string;
    };
  };
  fromCity?: {
    name?: string;
  };
  toCity?: {
    name?: string;
  };
  lowestPrice?: number;
};

type Props = {
  routes?: Route[];
};

export default function RoutesSection({ routes }: Props) {
  if (!routes || routes.length === 0) return null;

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* HEADING */}
        <div className="relative text-center mb-14">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[90px] md:text-[140px] font-extrabold text-gray-200 opacity-40 leading-none pointer-events-none select-none">
            ROUTES
          </span>

          <h2 className="relative text-3xl md:text-4xl font-bold tracking-tight">
            Popular Vehicle Transport Routes
          </h2>
        </div>

        {/* GRID */}
        <div className="flex justify-center">
          {routes.map((route, index) => {
            const from = route.fromCity?.name || "";
            const to = route.toCity?.name || "";

            return (
              <Link
                key={index}
                href={`/vehicle-transport/${route.slug?.current}`}
                className="group w-full max-w-md"
              >
                <div
                  className="
                    bg-white rounded-2xl overflow-hidden
                    border border-gray-200
                    transition-all duration-300
                    hover:-translate-y-2
                    hover:shadow-[0_25px_70px_rgba(0,0,0,0.08)]
                  "
                >
                  {/* IMAGE */}
                  <div className="relative h-52 w-full bg-gray-50">
                    <Image
                      src={
                        route.routeImage?.asset?.url ||
                        "/images/placeholder.jpg"
                      }
                      alt={`${from} to ${to}`}
                      fill
                      className="object-contain p-10"
                    />

                    <div className="absolute top-4 left-4 bg-[#311d60] text-white text-xs px-3 py-1 rounded-full shadow">
                      Top Route
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 text-center">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {from} → {to}
                    </h3>

                    {/* 🔥 PRICE (CORRECT PLACE) */}
                    {route.priceType === "quoteRequired" ? (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Price
                        </span>
                        <div className="text-[#311d60] text-lg font-semibold leading-tight">
                          Quote Required
                        </div>
                      </div>
                    ) : route.lowestPrice ? (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          From
                        </span>
                        <div className="text-[#311d60] text-lg font-semibold leading-tight">
                          R{route.lowestPrice.toLocaleString()}
                        </div>
                      </div>
                    ) : null}
                    <span className="text-sm font-medium text-[#311d60]">
                      View Route →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/vehicle-transport"
            className="text-[#311d60] font-medium hover:underline"
          >
            View all routes →
          </Link>
        </div>
      </div>
    </section>
  );
}
