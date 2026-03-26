import Image from "next/image";

type Feature = {
  title?: string;
  description?: string;
  icon?: {
    asset?: {
      url?: string;
    };
  };
};

type Props = {
  title?: string;
  features?: Feature[];
};

export default function WhyChoose({ title, features }: Props) {
  if (!features || features.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* SECTION TITLE */}
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12 text-gray-900">
            {title}
          </h2>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="
                bg-white
                p-8
                rounded-2xl
                shadow-sm
                text-center
                transition-all duration-300
                hover:-translate-y-2
                hover:shadow-[0_18px_40px_rgba(43,23,92,0.12)]
                group
              "
            >
              {/* ICON */}
              {item.icon?.asset?.url && (
                <div className="mb-6 flex justify-center">
                  <div className="relative w-16 h-16 rounded-2xl bg-[#311d60]/10 flex items-center justify-center group-hover:bg-[#311d60]/20 transition">
                    <div className="relative w-8 h-8">
                      <Image
                        src={item.icon.asset.url}
                        alt={item.title || ""}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TITLE */}
              {item.title && (
                <h3 className="font-semibold text-lg mb-3 text-gray-900">
                  {item.title}
                </h3>
              )}

              {/* DESCRIPTION */}
              {item.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
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
