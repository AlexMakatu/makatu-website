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
    <section className="py-16 md:py-20 bg-white">
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
                <div className="mx-auto mb-8 flex justify-center">
                  <div className="relative w-24 h-24 rounded-3xl bg-brand/15 shadow-[0_10px_30px_rgba(49,29,96,0.15)] flex items-center justify-center group-hover:bg-brand/25 transition">
                    <div className="relative w-20 h-20">
                      <Image
                        src={item.icon.asset.url}
                        alt={item.title || ""}
                        fill
                        className="object-contain scale-[1.6] group-hover:scale-[1.75] transition"
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
