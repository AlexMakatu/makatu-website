import Link from "next/link";

type Props = {
  seoContent?: string;
};

export default function RouteSEOContent({ seoContent }: Props) {
  if (!seoContent) return null;

  return (
    <section className="max-w-4xl mx-auto px-6 py-6 space-y-6">
      {/* CMS SEO Content */}
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {seoContent}
      </p>

      {/* 🔥 Internal Linking Block (Durban ↔ Gauteng) */}
      <div className="mt-8 rounded-xl border border-gray-200 p-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Popular routes from Durban
        </h3>

        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/vehicle-transport/durban-to-johannesburg-vehicle-transport"
            className="text-purple-600 hover:underline"
          >
            Durban → Johannesburg
          </Link>

          <Link
            href="/vehicle-transport/durban-to-pretoria-vehicle-transport"
            className="text-purple-600 hover:underline"
          >
            Durban → Pretoria
          </Link>
        </div>

        <h4 className="mt-6 text-md font-semibold text-gray-900">
          Routes to Durban
        </h4>

        <div className="grid sm:grid-cols-2 gap-3 mt-2">
          <Link
            href="/vehicle-transport/johannesburg-to-durban-vehicle-transport"
            className="text-purple-600 hover:underline"
          >
            Johannesburg → Durban
          </Link>

          <Link
            href="/vehicle-transport/pretoria-to-durban-vehicle-transport"
            className="text-purple-600 hover:underline"
          >
            Pretoria → Durban
          </Link>
        </div>
      </div>
    </section>
  );
}
