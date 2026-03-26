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
  if (!features || features.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(49,29,96,0.06),transparent_65%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 md:px-6 relative">
        {/* TITLE */}
        {title && (
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              {title}
            </h2>

            <div className="mt-5 h-[3px] w-16 bg-brand mx-auto rounded-full" />
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-14 sm:gap-x-10">
          {features.map((item, index) => (
            <div
              key={index}
              className="group relative text-center max-w-xs mx-auto"
            >
              {/* ICON */}
              {item.icon?.asset?.url && (
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    {/* glow */}
                    <div className="absolute inset-0 rounded-full bg-brand/15 blur-2xl opacity-80 group-hover:opacity-100 transition" />

                    {/* icon container */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-100">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
                        <Image
                          src={item.icon.asset.url}
                          alt={item.title || ""}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TITLE */}
              {item.title && (
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
              )}

              {/* DESCRIPTION */}
              {item.description && (
                <p className="text-base text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* divider */}
              <div className="hidden lg:block absolute top-10 right-[-20px] w-[1px] h-14 bg-gray-200 last:hidden" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
