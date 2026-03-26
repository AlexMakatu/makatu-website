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

  // Optional (add later when hooked to routeRate)
  lowestPrice?: number;
};

type Props = {
  routes?: Route[];
};

export default function RoutesSection({ routes }: Props) {
  if (!routes || routes.length === 0) return null;

  return (
    <section className="py-14 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* HEADING (MATCHES OTHER SECTIONS) */}
        <div className="relative text-center mb-12">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[90px] md:text-[140px] font-extrabold text-gray-200 opacity-40 leading-none pointer-events-none select-none">
            ROUTES
          </span>

          <h2 className="relative text-3xl md:text-4xl font-bold">
            Popular Vehicle Transport Routes
          </h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routes.slice(0, 3).map((route, index) => {
            const from = route.fromCity?.name || "";
            const to = route.toCity?.name || "";

            return (
              <Link
                key={index}
                href={`/vehicle-transport/${route.slug?.current}`}
                className="group"
              >
                <div
                  className="
                    bg-gray-50 rounded-2xl overflow-hidden
                    border border-gray-100
                    transition-all duration-300
                    hover:-translate-y-2
                    hover:shadow-[0_18px_40px_rgba(43,23,92,0.12)]
                  "
                >
                  {/* IMAGE */}
                  <div className="relative h-44 w-full">
                    <Image
                      src={
                        route.routeImage?.asset?.url ||
                        "/images/placeholder.jpg"
                      }
                      alt={`${from} to ${to}`}
                      fill
                      className="object-contain p-6"
                    />

                    {/* BADGE */}
                    <div className="absolute top-3 left-3 bg-[#311d60] text-white text-xs px-3 py-1 rounded-full">
                      Top Route
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 text-center">
                    <h3 className="font-semibold text-base mb-1 text-gray-900">
                      {from} → {to}
                    </h3>

                    {/* PRICE (optional but powerful) */}
                    {route.lowestPrice && (
                      <div className="text-[#311d60] font-semibold mb-2">
                        From R{route.lowestPrice}
                      </div>
                    )}

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {route.routeSummary}
                    </p>

                    <span className="text-sm font-medium text-[#311d60] group-hover:underline">
                      View Route →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
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
