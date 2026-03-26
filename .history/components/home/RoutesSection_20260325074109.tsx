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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden
                    border border-gray-100/60
                    transition-all duration-300 ease-out
                    hover:-translate-y-2
                    hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                    hover:border-[#311d60]/20
                  "
                >
                  {/* IMAGE */}
                  <div className="relative h-48 w-full bg-gradient-to-br from-gray-50 to-white">
                    <Image
                      src={
                        route.routeImage?.asset?.url ||
                        "/images/placeholder.jpg"
                      }
                      alt={`${from} to ${to}`}
                      fill
                      className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* BADGE */}
                    <div className="absolute top-4 left-4 bg-[#311d60] text-white text-xs px-3 py-1 rounded-full shadow-md">
                      Top Route
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 text-center">
                    <h3 className="font-semibold text-lg mb-1 text-gray-900 tracking-tight">
                      {from} → {to}
                    </h3>

                    {/* PRICE */}
                    {route.lowestPrice && (
                      <div className="text-[#311d60] font-semibold mb-2">
                        From R{route.lowestPrice}
                      </div>
                    )}

                    <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">
                      {route.routeSummary}
                    </p>

                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#311d60] transition-all group-hover:gap-2">
                      View Route
                      <span>→</span>
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
