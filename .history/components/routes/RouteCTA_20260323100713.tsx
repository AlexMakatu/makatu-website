import Link from "next/link";

type Props = {
  fromCity?: string;
  toCity?: string;
  startingPrice?: number; // optional but recommended
};

export default function RouteCTA({ fromCity, toCity, startingPrice }: Props) {
  const quoteUrl = `/get-a-quote?fromCity=${encodeURIComponent(
    fromCity || "",
  )}&toCity=${encodeURIComponent(toCity || "")}`;

  return (
    <section className="bg-[#311d60] text-white py-20 mt-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Get a Quote for {fromCity} → {toCity}
        </h2>

        {/* PRICE CONTEXT */}
        {startingPrice && (
          <p className="text-lg text-white/90 mb-2">From R{startingPrice}</p>
        )}

        <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
          Secure and reliable vehicle transport between {fromCity} and {toCity}.
        </p>

        {/* SINGLE PRIMARY CTA */}
        <Link
          href={quoteUrl}
          className="inline-block bg-white text-[#311d60] px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
        >
          Get Instant Quote
        </Link>
      </div>
    </section>
  );
}
