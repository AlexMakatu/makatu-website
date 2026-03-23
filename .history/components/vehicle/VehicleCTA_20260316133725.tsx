import Link from "next/link";

type Props = {
  title?: string;
  text?: string;
  background?: string;
};

export default function VehicleCTA({
  title,
  text,
  background = "bg-white",
}: Props) {
  return (
    <section
      className={`${background} py-24`}
      aria-labelledby="vehicle-transport-cta"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* HEADING */}

        {title && (
          <h2
            id="vehicle-transport-cta"
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            {title}
          </h2>
        )}

        {/* TEXT */}

        {text && (
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            {text}
          </p>
        )}

        {/* CTA BUTTON */}

        <Link
          href="/get-a-quote"
          className="inline-block bg-black text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition"
        >
          Request a Quote
        </Link>
      </div>
    </section>
  );
}
