import Image from "next/image";

type Partner = {
  name?: string;
  logo?: {
    asset?: {
      url?: string; // ✅ FIXED TYPE
    };
    alt?: string;
  };
};

type Props = {
  items?: Partner[];
  background?: string;
};

export default function Partners({ items, background = "bg-white" }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`${background} py-16`}>
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-semibold mb-10">
          Trusted by Businesses Across South Africa
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-12">
          {items.map((item, i) => {
            // ✅ USE URL (not _ref)
            const imageUrl = item.logo?.asset?.url || null;

            return (
              <div key={i} className="flex items-center justify-center">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.logo?.alt || item.name || "Partner"}
                    width={120}
                    height={60}
                    className="object-contain opacity-80 hover:opacity-100 transition"
                  />
                ) : (
                  <span className="px-4 py-2 border rounded-full text-sm text-gray-600">
                    {item.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
