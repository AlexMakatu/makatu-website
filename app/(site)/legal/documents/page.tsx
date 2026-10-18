import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Documents & Certificates | Makatu",
  description:
    "Download Makatu Business Enterprises company documents, B-BBEE certificates, insurance and compliance documents for vehicle transport clients.",
  alternates: { canonical: "/legal/documents" },
};

export const dynamic = "force-dynamic";

type DocumentFile = {
  _id: string;
  title: string;
  file?: {
    asset?: {
      url: string;
    };
  };
  category?: string;
};

const query = groq`
  *[_type == "documentFile"]{
    _id,
    title,
    category,
    file{
      asset->{
        url
      }
    }
  }
`;

export default async function DocumentsPage() {
  const documents = await client.fetch<DocumentFile[]>(
    query,
    {},
    {
      cache: "no-store",
      useCdn: false,
    },
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-10">Documents & Certificates</h1>

      <div className="space-y-4">
        {documents.map((doc) => {
          const fileUrl = doc.file?.asset?.url;

          return (
            <div
              key={doc._id}
              className="border rounded-xl p-6 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{doc.title}</h2>

                {doc.category && (
                  <p className="text-sm text-gray-500">{doc.category}</p>
                )}
              </div>

              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium"
                >
                  Download
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
