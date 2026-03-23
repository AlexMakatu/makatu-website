import Link from "next/link";

type Route = {
  title?: string;
  slug?: {
    current?: string;
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
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Major Vehicle Transport Routes
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {routes?.map((route, index) => (
            <div
              key={index}
              className="border rounded-lg p-6 text-center hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg mb-4">
                {route.fromCity?.name} → {route.toCity?.name}
              </h3>

              <Link
                href={`/vehicle-transport/${route.slug?.current}`}
                className="text-blue-600 font-medium"
              >
                View Route →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
