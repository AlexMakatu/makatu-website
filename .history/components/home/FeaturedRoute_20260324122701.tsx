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
    <section className="py-20 bg-gray-100">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {from} to {to} Vehicle Transport
        </h2>

        <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto mb-6">
          Makatu specialises in vehicle transport between {from} and {to}, one
          of the busiest long-distance routes in South Africa. Whether you need
          to move a car from {from} to {to} or from {to} to {from}, we provide
          reliable, scheduled delivery with safe and efficient transport.
        </p>

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
