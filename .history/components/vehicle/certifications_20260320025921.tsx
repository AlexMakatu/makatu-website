import Image from "next/image";

type CertificationItem = {
  name?: string;
  issuer?: string;
  description?: string;
  logo?: {
    asset?: {
      url?: string;
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

  const isDark = background?.includes("text-white");

  return (
    <section className={`${background} py-20`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADING */}
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Certifications & Compliance
          </h2>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 text-center transition ${
                isDark
                  ? "bg-white/10 border border-white/20 backdrop-blur text-white"
                  : "bg-white border hover:shadow-md"
              }`}
            >
              {/* LOGO */}
              {item.logo?.asset?.url && (
                <div className="flex justify-center mb-4">
                  <Image
                    src={item.logo.asset.url}
                    alt={item.logo.alt || item.name || "Certification"}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              )}

              {/* NAME */}
              {item.name && (
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.name}
                </h3>
              )}

              {/* ISSUER */}
              {item.issuer && (
                <p
                  className={`text-sm mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {item.issuer}
                </p>
              )}

              {/* DESCRIPTION */}
              {item.description && (
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
