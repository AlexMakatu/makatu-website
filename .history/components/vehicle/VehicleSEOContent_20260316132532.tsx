import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";

type Props = {
  content?: PortableTextBlock[];
};

export default function VehicleSEOContent({ content }: Props) {
  if (!content) return null;

  return (
    <section className="max-w-4xl mx-auto my-24">
      <div className="prose lg:prose-lg max-w-none">
        <PortableText value={content} />
      </div>
    </section>
  );
}
