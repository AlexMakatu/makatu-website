import Link from "next/link";

type Props = {
  title?: string;
  text?: string;
  background?: string;
};

export default function VehicleCTA({
  title,
  text,
  background = "bg-gray-50",
}: Props) {
  return (
    <section
      className={`${background} py-20 md:py-24`}
      aria-labelledby="vehicle-transport-cta"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* HEADING */}
        {title && (
          <h2
            id="vehicle-transport-cta"
            className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-6"
          >
            {title}
          </h2>
        )}

        {/* TEXT */}
        {text && (
          <p className="text-base md:text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {text}
          </p>
        )}

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
