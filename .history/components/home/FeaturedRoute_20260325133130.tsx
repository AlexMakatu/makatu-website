import Link from "next/link";

type Route = {
  slug?: { current?: string };
  fromCity?: { name?: string };
  toCity?: { name?: string };
};

type Props = {
  route?: Route;
};

export default function FeaturedRoute({ route }: Props) {
  if (!route) return null;

  const from = route.fromCity?.name || "";
  const to = route.toCity?.name || "";

  return (
    <section className="py-24 bg-gray-100 border-b border-gray-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADING BLOCK */}
        <div className="relative mb-10 text-center">
          {/* BACKGROUND WORD */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[90px] md:text-[160px] font-extrabold text-[#311d60]/20 opacity-30 leading-none pointer-events-none select-none">
            TRANSPORT
          </span>

          {/* FOREGROUND TITLE */}
          <h2 className="relative text-3xl md:text-4xl font-bold">
            {from} to {to} Vehicle Transport
          </h2>
        </div>

        {/* CONTENT */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-gray-600 text-lg leading-relaxed">
            Makatu specialises in vehicle transport between {from} and {to}, one
            of the busiest long-distance routes in South Africa. Whether you
            need to move a car from {from} to {to} or from {to} to {from}, we
            provide reliable, scheduled delivery with safe and efficient
            transport.
          </p>
        </div>

        {/* CTA */}
        {/* CTA */}
        <div className="flex justify-center mb-10">
          <Link
            href={`/vehicle-transport/${mainRoute?.slug?.current}`}
            className="px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition"
          >
            {from} to {to} vehicle transport
          </Link>
        </div>

        {/* DIVIDER */}
        <div className="flex justify-center">
          <div className="w-16 h-[1px] bg-black/10" />
        </div>
      </div>
    </section>
  );
}
