import Link from "next/link";

type Props = {
  title?: string;
  text?: string;
  background?: string;
};

export default function VehicleCTA({
  title,
  text,
  background = "bg-[#1E1338]",
}: Props) {
  return (
    <section
      className={`${background} py-24 md:py-28`}
      aria-labelledby="vehicle-transport-cta"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* LABEL */}
        <p className="text-xs uppercase tracking-[0.22em] text-white/50 mb-4">
          Instant Pricing
        </p>

        {/* HEADING */}
        <h2
          id="vehicle-transport-cta"
          className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6"
        >
          Get Your Vehicle Transport Quote
        </h2>

        {/* TEXT */}
        <p className="text-base md:text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
          Get a fast and reliable vehicle transport quote for routes across
          South Africa including Johannesburg, Cape Town and Durban.
        </p>

        {/* CTA BUTTON */}
        <Link
          href="/get-a-quote"
          className="inline-block bg-brand text-white px-8 py-3 rounded-full font-medium text-base md:text-lg hover:opacity-90 transition"
        >
          Get Your Instant Quote
        </Link>
      </div>
    </section>
  );
}
