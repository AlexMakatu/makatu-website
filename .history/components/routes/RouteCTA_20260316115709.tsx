import Link from "next/link";

type Props = {
  fromCity?: string;
  toCity?: string;
};

export default function RouteCTA({ fromCity, toCity }: Props) {
  return (
    <section className="bg-[#311d60] text-white py-20 mt-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Get a Quote for {fromCity} → {toCity}
        </h2>

        <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
          Secure and reliable vehicle transport between {fromCity} and {toCity}.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/get-a-quote"
            className="bg-white text-[#311d60] px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
          >
            Get Instant Quote
          </Link>

          <Link
            href="/contact"
            className="border border-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-[#311d60] transition"
          >
            Speak to Our Team
          </Link>
        </div>
      </div>
    </section>
  );
}
