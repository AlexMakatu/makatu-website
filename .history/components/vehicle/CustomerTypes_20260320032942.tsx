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
        {/* HEADING */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Who We Serve
          </h2>

          <p className="text-gray-600 mt-5 text-base md:text-lg leading-relaxed">
            From individuals relocating to dealerships and fleet operators, we
            support a wide range of vehicle transport needs across South Africa.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((item, index) => (
            <div
              key={index}
              className="
                group
                relative
                text-center
                px-8 py-10
                rounded-2xl
                border border-gray-100
                bg-white/70 backdrop-blur-md
                transition-all duration-300
                hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                hover:-translate-y-1
              "
            >
              {/* ICON */}
              {item.image?.asset?.url && (
                <div className="flex justify-center mb-6">
                  <div
                    className="
                      w-16 h-16
                      rounded-full
                      bg-brand/10
                      flex items-center justify-center
                      transition
                      group-hover:bg-brand/20
                      group-hover:scale-105
                    "
                  >
                    <Image
                      src={item.image.asset.url}
                      alt={item.image.alt || item.title || "Customer type"}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              {/* TITLE */}
              {item.title && (
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
              )}

              {/* DESCRIPTION */}
              {item.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* SUBTLE GLOW */}
              <div
                className="
                absolute inset-0 rounded-2xl
                opacity-0 group-hover:opacity-100
                transition
                bg-gradient-to-br from-brand/5 to-transparent
                pointer-events-none
              "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
