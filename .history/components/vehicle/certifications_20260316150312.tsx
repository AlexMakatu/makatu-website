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
        {/* SECTION TITLE */}

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            Who Uses Our Vehicle Transport Services
          </h2>
        </div>

        {/* GRID */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {items.map((item, index) => (
            <div key={index} className="text-center max-w-xs mx-auto">
              {/* IMAGE / ICON */}

              {item.image?.asset?.url && (
                <div className="relative w-full h-[120px] mb-4">
                  <Image
                    src={item.image.asset.url}
                    alt={item.image.alt || item.title || "Customer type"}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              {/* TITLE */}

              {item.title && (
                <h3 className="font-semibold mb-2">{item.title}</h3>
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
