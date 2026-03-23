import Image from "next/image";

type Step = {
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
  description?: string; // ✅ NEW
  steps?: Step[];
};

export default function ProcessSection({ title, description, steps }: Props) {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          {title}
        </h2>

        {description && (
          <p className="text-center text-gray-600 max-w-xl mx-auto mb-10 md:mb-12">
            {description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {steps?.map((step, index) => (
            <div
              key={index}
              className="bg-white p-5 md:p-6 rounded-xl shadow-sm border flex gap-4 items-start hover:shadow-md hover:-translate-y-1 transition"
            >
              {/* Step number */}
              <div className="w-8 h-8 flex items-center justify-center bg-[#311d60] text-white rounded-full text-sm font-semibold shrink-0">
                {index + 1}
              </div>

              {/* Icon */}
              {step.icon?.asset?.url && (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg shrink-0">
                  <Image
                    src={step.icon.asset.url}
                    alt={step.title || ""}
                    width={26}
                    height={26}
                  />
                </div>
              )}

              {/* Content */}
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-2">
                  {step.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
