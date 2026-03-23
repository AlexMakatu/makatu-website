import Image from "next/image";

type PartnerItem = {
  name?: string;
  logo?: {
    asset?: {
      url: string;
    };
    alt?: string;
  };
};

type Props = {
  items?: PartnerItem[];
  background?: string;
};

export default function Partners({ items, background = "bg-gray-50" }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`${background} py-20`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* SECTION TITLE */}

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            Trusted by Businesses Across South Africa
          </h2>
        </div>

        {/* LOGO GRID */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-center">
              {item.logo?.asset?.url && (
                <div className="relative h-[70px] w-full max-w-[160px]">
                  <Image
                    src={item.logo.asset.url}
                    alt={item.logo.alt || item.name || "Partner logo"}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
