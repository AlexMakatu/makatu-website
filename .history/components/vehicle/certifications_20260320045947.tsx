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
};

export default function Certifications({
  items,
  background = "bg-gray-50",
}: Props) {
  if (!items || items.length === 0) return null;

  const isDark = background === "bg-brand" || background === "bg-gray-900";

  return (
    <section className={`${background} py-20 md:py-24`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-14 md:mb-16">
          <p
            className={`text-xs uppercase tracking-[0.22em] mb-3 ${
              isDark ? "text-white/60" : "text-gray-500"
            }`}
          >
            Trust & Compliance
          </p>

          <h2
            className={`text-3xl md:text-4xl font-semibold tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Certifications & Compliance
          </h2>
        </div>

        {/* GRID */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const isComingSoon = item.status === "comingSoon";

            return (
              <article
                key={`${item.name ?? "cert"}-${index}`}
                className="relative mx-auto w-full max-w-sm rounded-2xl p-5 md:p-6 text-center bg-white border border-gray-100 shadow-xl hover:shadow-2xl transition"
              >
                {isComingSoon && (
                  <div className="absolute top-4 right-4 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600">
                    Coming Soon
                  </div>
                )}

                {item.logo?.asset && (
                  <div className="flex justify-center items-center mb-6 min-h-[60px]">
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
                  <h3 className="text-xl font-semibold mb-2 text-brand">
                    {item.name}
                  </h3>
                )}

                {item.issuer && (
                  <p className="text-sm mb-2 text-brand/70">{item.issuer}</p>
                )}

                {item.description && (
                  <p className="text-sm leading-relaxed text-brand/80">
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
