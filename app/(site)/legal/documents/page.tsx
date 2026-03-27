import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

type DocumentFile = {
  _id: string;
  title: string;
  file: {
    asset: {
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
  const documents: DocumentFile[] = await client.fetch(query);

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-10">Documents & Certificates</h1>

      <div className="space-y-4">
        {documents.map((doc) => (
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

            <a
              href={doc.file.asset.url}
              target="_blank"
              className="text-blue-600 font-medium"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
