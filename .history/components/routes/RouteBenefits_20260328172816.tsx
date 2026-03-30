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
  const validBenefits =
    benefits?.filter((b): b is NonNullable<Benefit> => Boolean(b?.title)) ?? [];

  if (validBenefits.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Why Choose Makatu</h2>

        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Reliable vehicle transport backed by trusted carriers and nationwide
          logistics expertise.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {validBenefits.map((benefit, index) => (
          <div
            key={`${benefit.title}-${index}`}
            className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            {/* Icon */}
            {benefit.icon?.asset?.url && (
              <div className="mb-4">
                <Image
                  src={benefit.icon.asset.url}
                  alt={benefit.title ?? ""}
                  width={40}
                  height={40}
                />
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900">
              {benefit.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
