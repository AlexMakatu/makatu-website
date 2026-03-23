import Image from "next/image";

type VehicleTypeItem = {
  title?: string;
  description?: string;
  image?: {
    asset?: {
      url: string;
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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Vehicle Types We Transport</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition"
            >
              {/* IMAGE */}

              {item.image?.asset?.url && (
                <div className="relative h-[180px]">
                  <Image
                    src={item.image.asset.url}
                    alt={item.image.alt || item.title || "Vehicle transport"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* CONTENT */}

              <div className="p-6">
                {item.title && (
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                )}

                {item.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
