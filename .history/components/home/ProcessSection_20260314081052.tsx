import Image from "next/image";

type Step = {
  title?: string;
  stepDescription?: string;
  icon?: {
    asset?: {
      url?: string;
    };
  };
};

type Props = {
  title?: string;
  steps?: Step[];
};

export default function ProcessSection({ title, steps }: Props) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-6">{title}</h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Scheduled vehicle transport for private clients, dealerships, and
          fleet operators across South Africa.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {steps?.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border flex gap-4"
            >
              {step.icon?.asset?.url && (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
                  <Image
                    src={step.icon.asset.url}
                    alt={step.title || ""}
                    width={24}
                    height={24}
                  />
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.stepDescription}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
