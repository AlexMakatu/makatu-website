import Link from "next/link";

type Background = "white" | "lightGray" | "brandLight" | "brandDark" | "dark";

type Props = {
  title?: string;
  text?: string;
  label?: string;
  background?: Background;
};

export default function VehicleCTA({
  title,
  text,
  label,
  background = "brandDark",
}: Props) {
  // 🎨 BACKGROUND MAP
  const backgroundMap: Record<Background, string> = {
    white: "bg-white",
    lightGray: "bg-gray-50",
    brandLight: "bg-brand/10",
    brandDark: "bg-[#1E1338]",
    dark: "bg-gray-900",
  };

  const isDark = background === "brandDark" || background === "dark";

  return (
    <section
      className={`${backgroundMap[background]} py-24 md:py-28`}
      aria-labelledby="vehicle-transport-cta"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* LABEL */}
        {label && (
          <p
            className={`text-xs uppercase tracking-[0.22em] mb-4 ${
              isDark ? "text-white/50" : "text-gray-500"
            }`}
          >
            {label}
          </p>
        )}

        {/* HEADING */}
        {title && (
          <h2
            id="vehicle-transport-cta"
            className={`text-3xl md:text-4xl font-semibold tracking-tight mb-6 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h2>
        )}

        {/* TEXT */}
        {text && (
          <p
            className={`text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed ${
              isDark ? "text-white/70" : "text-gray-600"
            }`}
          >
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
