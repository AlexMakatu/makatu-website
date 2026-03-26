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
};

type Props = {
  routes?: Route[];
};

export default function RoutesSection({ routes }: Props) {
  if (!routes || routes.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* TITLE */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          Popular Vehicle Transport Routes
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {routes.slice(0, 3).map((route, index) => (
            <Link
              key={index}
              href={`/vehicle-transport/${route.slug?.current}`}
              className="group"
            >
              <div
                className="
                  bg-white rounded-2xl overflow-hidden
                  shadow-sm border border-gray-100
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-xl
                "
              >
                {/* IMAGE */}
                {route.routeImage?.asset?.url && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={route.routeImage.asset.url}
                      alt={`${route.fromCity?.name} to ${route.toCity?.name}`}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* BADGE */}
                    <div className="absolute top-3 left-3 bg-[#311d60] text-white text-xs px-3 py-1 rounded-full shadow">
                      Top Route
                    </div>
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    {route.fromCity?.name} → {route.toCity?.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                    {route.routeSummary}
                  </p>

                  {/* CTA */}
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[#311d60] group-hover:underline">
                    View Route →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* VIEW ALL CTA */}
        <div className="text-center mt-12">
          <Link
            href="/vehicle-transport"
            className="inline-flex items-center gap-2 text-[#311d60] font-medium hover:underline"
          >
            View all routes →
          </Link>
        </div>
      </div>
    </section>
  );
}
