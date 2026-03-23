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
    <section className={`${background} py-24`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADING */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Who We Serve
          </h2>

          <p className="text-gray-600 mt-4 text-base md:text-lg leading-relaxed">
            From individuals relocating to dealerships and fleet operators, we
            support a wide range of vehicle transport needs across South Africa.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="
            group
            text-center
            px-6 py-8
            rounded-2xl
            transition-all duration-300
            hover:bg-white
            hover:shadow-xl
            hover:-translate-y-1
          "
            >
              {/* ICON WRAPPER */}
              {item.image?.asset?.url && (
                <div className="flex justify-center mb-5">
                  <div
                    className="
                w-14 h-14
                rounded-full
                bg-brand/10
                flex items-center justify-center
                group-hover:bg-brand/20
                transition
              "
                  >
                    <Image
                      src={item.image.asset.url}
                      alt={item.image.alt || item.title || "Customer type"}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
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
