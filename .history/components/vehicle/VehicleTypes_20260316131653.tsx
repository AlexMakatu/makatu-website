import Image from "next/image";

type Item = {
  title?: string;
  description?: string;
  image?: {
    asset?: { url: string };
    alt?: string;
  };
};

export default function VehicleTypes({ items }: { items?: Item[] }) {
  if (!items) return null;

  return (
    <section className="mb-24">
      <h2 className="text-2xl font-semibold text-center mb-12">
        Vehicle Types We Transport
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden bg-white"
          >
            {item.image?.asset?.url && (
              <div className="relative h-[180px]">
                <Image
                  src={item.image.asset.url}
                  alt={item.image.alt || ""}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>

              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
