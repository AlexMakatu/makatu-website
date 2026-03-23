import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type CertificationStatus = "active" | "comingSoon";

type CertificationItem = {
  name?: string;
  issuer?: string;
  description?: string;
  status?: CertificationStatus;
  logo?: {
    asset?: {
      _ref?: string;
    };
    alt?: string;
  };
};

type Props = {
  items?: CertificationItem[];
  background?: string;
  isDark?: boolean;
};

export default function Certifications({
  items,
  background = "bg-gray-50",
  isDark = true,
}: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`${background} py-20 md:py-24`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 md:mb-16">
          <p
            className={`text-xs md:text-sm uppercase tracking-[0.22em] mb-3 ${
              isDark ? "text-white/60" : "text-gray-500"
            }`}
          >
            Trust & Compliance
          </p>

          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Certifications & Compliance
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const isComingSoon = item.status === "comingSoon";

            return (
              <article
                key={`${item.name ?? "certification"}-${index}`}
                className={`relative mx-auto w-full max-w-sm rounded-3xl p-8 text-center transition duration-300 ${
                  isDark
                    ? "border border-white/10 bg-white/8 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.18)] hover:border-white/20 hover:bg-white/12"
                    : "border border-gray-200 bg-white shadow-sm hover:shadow-lg"
                }`}
              >
                {isComingSoon && (
                  <div
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${
                      isDark
                        ? "border border-white/15 bg-white/10 text-white/80"
                        : "border border-gray-200 bg-gray-100 text-gray-600"
                    }`}
                  >
                    Coming Soon
                  </div>
                )}

                {item.logo?.asset && (
                  <div className="flex justify-center mb-6 min-h-[72px] items-center">
                    <Image
                      src={urlFor(item.logo).width(240).quality(95).url()}
                      alt={item.logo.alt || item.name || "Certification"}
                      width={140}
                      height={70}
                      className="h-14 md:h-16 w-auto object-contain"
                    />
                  </div>
                )}

                {item.name && (
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.name}
                  </h3>
                )}

                {item.issuer && (
                  <p
                    className={`text-sm mb-3 ${
                      isDark ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    {item.issuer}
                  </p>
                )}

                {item.description && (
                  <p
                    className={`text-sm leading-7 ${
                      isDark ? "text-white/75" : "text-gray-600"
                    }`}
                  >
                    {item.description}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
