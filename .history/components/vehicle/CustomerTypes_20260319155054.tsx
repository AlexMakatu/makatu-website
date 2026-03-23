import Image from "next/image";

type CustomerTypeItem = {
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
  items?: CustomerTypeItem[];
  background?: string;
};

export default function CustomerTypes({
  items,
  background = "bg-white",
}: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`${background} py-20`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADING */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Who Uses Our Vehicle Transport Services
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            From individuals relocating to dealerships and fleet operators, we
            support a wide range of vehicle transport needs across South Africa.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {items.map((item, index) => (
            <div key={index} className="text-center px-4">
              {/* ICON */}
              {item.image?.asset?.url && (
                <div className="flex justify-center mb-4">
                  <Image
                    src={item.image.asset.url}
                    alt={item.image.alt || item.title || "Customer type"}
                    width={48}
                    height={48}
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
                <p className="text-sm text-gray-600 leading-relaxed">
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
