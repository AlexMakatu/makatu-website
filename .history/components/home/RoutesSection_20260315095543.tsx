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
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12">
          Major Vehicle Transport Routes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {routes?.map((route, index) => (
            <div
              key={index}
              className="border rounded-xl overflow-hidden bg-white hover:shadow-lg transition"
            >
              {route.routeImage?.asset?.url && (
                <Image
                  src={route.routeImage.asset.url}
                  alt={`${route.fromCity?.name} to ${route.toCity?.name} vehicle transport`}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-5 text-center">
                <h3 className="font-semibold text-lg mb-2">
                  {route.fromCity?.name} → {route.toCity?.name}
                </h3>

                <p className="text-gray-600 text-sm mb-5">
                  {route.routeSummary}
                </p>

                <Link
                  href={`/vehicle-transport/${route.slug?.current}`}
                  className="inline-block bg-black text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                >
                  View Route
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
