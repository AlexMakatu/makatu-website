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
  background = "bg-gradient-to-b from-white to-gray-50",
}: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`${background} py-28`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900">
            Who We Serve
          </h2>

          <p className="text-gray-600 mt-5 text-base md:text-lg leading-relaxed">
            From individuals relocating to dealerships and fleet operators, we
            support a wide range of vehicle transport needs across South Africa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {items.map((item, index) => (
            <div
              key={index}
              className="
                relative
                group
                rounded-3xl
                border border-gray-100
                bg-white
                px-8
                pt-20
                pb-10
                text-center
                shadow-sm
                transition-all duration-300
                hover:-translate-y-2
                hover:shadow-[0_18px_50px_rgba(43,23,92,0.10)]
              "
            >
              {item.image?.asset?.url && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                  <div
                    className="
      h-24 w-24
      rounded-3xl
      bg-brand
      shadow-[0_12px_30px_rgba(43,23,92,0.22)]
      flex items-center justify-center
      group-hover:scale-105
      transition
    "
                  >
                    <div
                      className="
        h-20 w-20
        rounded-2xl
        bg-white
        flex items-center justify-center
        overflow-hidden
      "
                    >
                      <Image
                        src={item.image.asset.url}
                        alt={item.image.alt || item.title || "Customer type"}
                        fill
                        className="
    object-cover
    scale-110
  "
                      />
                    </div>
                  </div>
                </div>
              )}

              {item.title && (
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {item.title}
                </h3>
              )}

              {item.description && (
                <p className="text-base leading-8 text-gray-600">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-sm text-gray-500">
            Trusted by leading automotive brands and enterprise partners across
            South Africa.
          </p>
        </div>
      </div>
    </section>
  );
}
