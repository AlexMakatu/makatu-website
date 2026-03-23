import Image from "next/image";

type CertificationItem = {
  name?: string;
  issuer?: string;
  description?: string;
  logo?: {
    asset?: {
      url: string;
    };
    alt?: string;
  };
};

type Props = {
  items?: CertificationItem[];
  background?: string;
};

export default function Certifications({
  items,
  background = "bg-gray-50",
}: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`${background} py-20`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* SECTION TITLE */}

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Certifications & Compliance</h2>
        </div>

        {/* GRID */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg p-6 text-center hover:shadow-md transition"
            >
              {/* LOGO */}

              {item.logo?.asset?.url && (
                <div className="relative h-[80px] mb-4">
                  <Image
                    src={item.logo.asset.url}
                    alt={item.logo.alt || item.name || "Certification"}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              {/* NAME */}

              {item.name && <h3 className="font-semibold mb-1">{item.name}</h3>}

              {/* ISSUER */}

              {item.issuer && (
                <p className="text-sm text-gray-500 mb-2">{item.issuer}</p>
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
