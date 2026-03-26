import Link from "next/link";

type Route = {
  slug?: { current?: string };
  fromCity?: { name?: string };
  toCity?: { name?: string };
};

type Props = {
  routes: Route[];
};

export default function FeaturedRoute({ routes }: Props) {
  if (!routes || routes.length === 0) return null;

  // Pick the first featured route as primary
  const mainRoute = routes[0];

  const from = mainRoute?.fromCity?.name || "";
  const to = mainRoute?.toCity?.name || "";

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Dynamic Heading */}
        <h2 className="text-3xl font-bold mb-4">
          {from} to {to} Vehicle Transport
        </h2>

        {/* Dynamic Intro */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Makatu specialises in vehicle transport between {from} and {to}, one
          of the busiest long-distance routes in South Africa. Whether you need
          to move a car from {from} to {to} or from {to} to {from}, we provide
          reliable, scheduled delivery with safe and efficient transport.
        </p>

        {/* Route Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {routes.map((route) => {
            const routeFrom = route.fromCity?.name;
            const routeTo = route.toCity?.name;
            const slug = route.slug?.current;

            if (!routeFrom || !routeTo || !slug) return null;

            return (
              <Link
                key={slug}
                href={`/vehicle-transport/${slug}`}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                {routeFrom} to {routeTo} vehicle transport
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
