import Image from "next/image";

type Feature = {
  title?: string;
  description?: string;
  icon?: {
    asset?: {
      url?: string;
    };
  };
};

type Props = {
  title?: string;
  features?: Feature[];
};

export default function WhyChoose({ title, features }: Props) {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features?.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition"
            >
              {item.icon?.asset?.url && (
                <Image
                  src={item.icon.asset.url}
                  alt={item.title || ""}
                  width={60}
                  height={60}
                  className="mx-auto mb-4"
                />
              )}

              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
