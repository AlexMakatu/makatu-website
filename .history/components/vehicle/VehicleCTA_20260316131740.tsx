import Link from "next/link";

type Props = {
  title?: string;
  text?: string;
};

export default function VehicleCTA({ title, text }: Props) {
  return (
    <section className="text-center py-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <p className="text-gray-600 mb-8 max-w-xl mx-auto">{text}</p>

      <Link
        href="/get-a-quote"
        className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800"
      >
        Request a Quote
      </Link>
    </section>
  );
}
