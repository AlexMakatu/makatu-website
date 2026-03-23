import Image from "next/image";

type Item = {
  name?: string;
  issuer?: string;
  description?: string;
  logo?: {
    asset?: { url: string };
    alt?: string;
  };
};

export default function Certifications({ items }: { items?: Item[] }) {
  if (!items) return null;

  return (
    <section className="mb-24 text-center">
      <h2 className="text-2xl font-semibold mb-12">
        Certifications & Compliance
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg p-6 bg-white">
            {item.logo?.asset?.url && (
              <div className="relative h-[80px] mb-4">
                <Image
                  src={item.logo.asset.url}
                  alt={item.logo.alt || ""}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <h3 className="font-semibold">{item.name}</h3>

            <p className="text-sm text-gray-500">{item.issuer}</p>

            <p className="text-sm text-gray-600 mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
