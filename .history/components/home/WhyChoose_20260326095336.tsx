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
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(49,29,96,0.05),transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 md:px-6 relative">
        {/* TITLE */}
        {title && (
          <div className="text-center mb-14 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>

            <div className="mt-4 h-[2px] w-12 bg-brand mx-auto rounded-full" />
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 sm:gap-x-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="group relative text-center max-w-xs mx-auto"
            >
              {/* ICON */}
              {item.icon?.asset?.url && (
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    {/* glow ring */}
                    <div className="absolute inset-0 rounded-full bg-brand/10 blur-xl opacity-70 group-hover:opacity-100 transition" />

                    {/* icon container */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12">
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
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
              )}

              {/* DESCRIPTION */}
              {item.description && (
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* subtle divider line (desktop only) */}
              <div className="hidden lg:block absolute top-8 right-[-16px] w-[1px] h-12 bg-gray-200 last:hidden" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
