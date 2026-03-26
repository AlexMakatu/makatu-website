import Link from "next/link";
import Image from "next/image";

type Route = {
  slug?: { current?: string };
  routeSummary?: string;
  routeImage?: {
    asset?: { url?: string };
  };
  fromCity?: { name?: string };
  toCity?: { name?: string };

  // 👇 ADD THIS (from your query later)
  lowestPrice?: number;
};

type Props = {
  routes?: Route[];
};

export default function RoutesSection({ routes }: Props) {
  if (!routes || routes.length === 0) return null;

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* TITLE */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Popular Vehicle Transport Routes
        </h2>

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
                    bg-white rounded-xl overflow-hidden
                    border border-gray-100
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-lg
                  "
                >
                  {/* IMAGE */}
                  <div className="relative h-40 w-full">
                    <Image
                      src={
                        route.routeImage?.asset?.url ||
                        "/images/placeholder.jpg"
                      }
                      alt={`${from} to ${to}`}
                      fill
                      className="object-cover"
                    />

                    {/* TOP BADGE */}
                    <div className="absolute top-3 left-3 bg-[#311d60] text-white text-xs px-3 py-1 rounded-full">
                      Top Route
                    </div>

                    {/* PRICE BADGE */}
                    {route.lowestPrice && (
                      <div className="absolute top-3 right-3 bg-white text-[#311d60] text-xs px-3 py-1 rounded-full shadow">
                        From R{route.lowestPrice}
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 text-center">
                    <h3 className="font-semibold text-base mb-2 text-gray-900">
                      {from} → {to}
                    </h3>

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
