import Link from "next/link";

type City = {
  name: string;
  slug: {
    current: string;
  };
};

type Props = {
  cities: City[];
};

export default function CityLinks({ cities }: Props) {
  if (!cities || cities.length === 0) return null;

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* HEADING */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Car Transport by City
        </h2>

        {/* GRID */}
        <div className="flex flex-wrap justify-center gap-3">
          {cities.map((city) => (
            <Link
              key={city.slug.current}
              href={`/vehicle-transport/city/${city.slug.current}`}
              className="
                px-4 py-2 rounded-full border border-gray-200
                text-sm font-medium text-gray-700
                hover:bg-brand hover:text-white hover:border-brand
                transition
              "
            >
              {city.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
