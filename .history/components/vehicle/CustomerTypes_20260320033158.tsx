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
        {/* HEADER */}
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Who We Serve
          </h2>

          <p className="text-gray-600 mt-5 text-base md:text-lg leading-relaxed">
            From individuals relocating to dealerships and fleet operators, we
            support a wide range of vehicle transport needs across South Africa.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {items.map((item, index) => (
            <div
              key={index}
              className="
                relative
                group
                pt-16
                px-8 pb-10
                text-center
                rounded-2xl
                border border-gray-100
                bg-white
                transition-all duration-300
                hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                hover:-translate-y-2
              "
            >
              {/* FLOATING ICON */}
              {item.image?.asset?.url && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div
                    className="
                      w-20 h-20
                      rounded-2xl
                      bg-gradient-to-br from-brand to-brand/70
                      flex items-center justify-center
                      shadow-lg
                      group-hover:scale-105
                      transition
                    "
                  >
                    <Image
                      src={item.image.asset.url}
                      alt={item.image.alt || item.title || "Customer type"}
                      width={40}
                      height={40}
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                </div>
              )}

              {/* TITLE */}
              {item.title && (
                <h3 className="text-lg font-semibold mt-4 mb-3">
                  {item.title}
                </h3>
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

        {/* TRUST LINE */}
        <div className="text-center mt-20">
          <p className="text-sm text-gray-500">
            Trusted by leading automotive brands including Ford and BMW
          </p>
        </div>
      </div>
    </section>
  );
}
