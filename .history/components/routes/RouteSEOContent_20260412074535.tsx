type Props = {
  seoContent?: string;
};

export default function RouteSEOContent({ seoContent }: Props) {
  if (!seoContent) return null;

  return (
    <section className="max-w-4xl mx-auto px-6 py-6">
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {seoContent}
      </p>
    </section>
  );
}
