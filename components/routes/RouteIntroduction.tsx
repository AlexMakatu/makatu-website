type Props = {
  introduction?: string;
};

export default function RouteIntroduction({ introduction }: Props) {
  if (!introduction) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 py-6">
      <p className="text-lg text-gray-700 leading-relaxed">{introduction}</p>
    </section>
  );
}
