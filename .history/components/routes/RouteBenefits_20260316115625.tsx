import Image from "next/image";

type SanityImage = {
  asset?: {
    url?: string;
  };
};

type Benefit = {
  title?: string;
  icon?: SanityImage;
} | null;

type Props = {
  benefits?: Benefit[];
};

export default function RouteBenefits({ benefits }: Props) {
  if (!benefits || benefits.filter((b) => b?.title).length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 py-6">
      <h2 className="text-2xl font-bold mb-6">Why Choose Makatu</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {benefits
          .filter((b): b is NonNullable<Benefit> => Boolean(b?.title))
          .map((benefit, index) => (
            <div
              key={`${benefit.title}-${index}`}
              className="bg-white border rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                {benefit.icon?.asset?.url && (
                  <Image
                    src={benefit.icon.asset.url}
                    alt={benefit.title ?? ""}
                    width={32}
                    height={32}
                  />
                )}

                <p className="font-medium text-gray-900">{benefit.title}</p>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
