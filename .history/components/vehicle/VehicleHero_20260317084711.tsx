import Image from "next/image";

type HeroImage = {
  asset?: {
    url: string;
  };
  alt?: string;
};

type Props = {
  heading?: string;
  text?: string;
  image?: HeroImage;
};

export default function VehicleHero({ heading, text, image }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white min-h-[720px] flex items-center">
      {/* RIGHT IMAGE */}
      {image?.asset?.url && (
        <div className="absolute inset-y-0 right-0 w-full md:w-[60%] z-0 pointer-events-none">
          <div className="relative w-full h-full">
            <Image
              src={image.asset.url}
              alt={image.alt || "Vehicle transport truck"}
              fill
              priority
              className="
                object-contain 
                object-right 
                scale-[1.05] 
                md:scale-100
              "
            />
          </div>
        </div>
      )}

      {/* LEFT GRADIENT OVERLAY */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[55%] bg-gradient-to-r from-white via-white/90 to-transparent z-10" />

      {/* CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-xl">
          {/* HEADING */}
          {heading && (
            <h1
              className="
              text-4xl 
              md:text-6xl 
              font-bold 
              leading-tight 
              text-gray-900 
              tracking-tight
            "
            >
              {heading}
            </h1>
          )}

          {/* TEXT */}
          {text && (
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">{text}</p>
          )}

          {/* BUTTONS */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/get-a-quote"
              className="
                bg-[#5B3CC4] 
                text-white 
                px-8 py-4 
                rounded-xl 
                font-semibold 
                shadow-md 
                hover:shadow-xl 
                hover:scale-[1.03] 
                transition-all duration-200
              "
            >
              Get a Quote
            </a>

            <a
              href="#vehicle-types"
              className="
                border border-gray-300 
                px-8 py-4 
                rounded-xl 
                font-semibold 
                text-gray-900 
                hover:bg-gray-100 
                transition-all duration-200
              "
            >
              View Transport Options
            </a>
          </div>

          {/* TRUST ROW */}
          <div className="mt-10 flex items-center gap-4">
            <div className="text-yellow-500 text-lg tracking-wide">★★★★★</div>

            <span className="text-gray-600 text-sm">
              Trusted by leading dealerships nationwide
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM GLOW */}
      <div className="absolute bottom-0 left-0 w-full h-[220px] pointer-events-none z-10">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,200,120,0.45),transparent_70%)] blur-[50px]" />
      </div>
    </section>
  );
}
