import Link from "next/link";

type LinkedRoute = {
  _id: string;
  title: string;
  slug?: {
    current?: string;
  };
};

type Props = {
  routes?: LinkedRoute[];
};

export default function RouteRelatedRoutes({ routes }: Props) {
  if (!routes || routes.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 py-6">
      <h2 className="text-2xl font-bold mb-6">
        Other Vehicle Transport Routes
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {routes.map((route) => (
          <Link
            key={route._id}
            href={`/vehicle-transport/${route.slug?.current}`}
            className="block bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <p className="font-medium text-gray-900">{route.title}</p>

            <p className="text-sm text-gray-500 mt-2">View route →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
