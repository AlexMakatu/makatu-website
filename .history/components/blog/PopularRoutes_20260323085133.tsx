import Link from "next/link";

type Route = {
  slug?: { current?: string };
  fromCity?: { name?: string };
  toCity?: { name?: string };
};

type Props = {
  routes: Route[];
};

export default function PopularRoutes({ routes }: Props) {
  if (!routes || routes.length === 0) return null;

  return (
    <div className="mt-20 pt-12 border-t border-gray-200">
      <h2 className="text-2xl md:text-3xl font-semibold mb-8">
        Popular Transport Routes
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {routes.map((route) => {
          const slug = route.slug?.current;
          if (!slug) return null;

          return (
            <Link
              key={slug}
              href={`/vehicle-transport/${slug}`}
              className="block p-5 border rounded-xl hover:shadow-md transition"
            >
              <p className="font-medium text-lg">
                {route.fromCity?.name} → {route.toCity?.name}
              </p>

              <p className="text-sm text-gray-500 mt-1">View route details</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
