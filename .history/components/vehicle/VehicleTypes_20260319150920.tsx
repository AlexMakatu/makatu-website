import Image from "next/image";

type VehicleTypeItem = {
  title?: string;
  description?: string;
  icon?: {
    asset?: {
      url?: string;
    };
    alt?: string;
  };
};

type Props = {
  items?: VehicleTypeItem[];
  background?: string;
};

export default function VehicleTypes({
  items,
  background = "bg-gray-50",
}: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`${background} py-20`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADING */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Vehicle Types We Transport
          </h2>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* ICON */}
              {item.icon?.asset?.url && (
                <div className="mb-4">
                  <Image
                    src={item.icon.asset.url}
                    alt={item.icon.alt || item.title || "Icon"}
                    width={40} // 👈 bigger
                    height={40} // 👈 bigger
                    className="object-contain"
                  />
                </div>
              )}

              {/* TITLE */}
              {item.title && (
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
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
