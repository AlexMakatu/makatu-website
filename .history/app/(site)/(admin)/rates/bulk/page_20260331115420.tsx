// app/(admin)/rates/bulk/page.tsx

import BulkUploadPage from "./BulkUploadPage";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <BulkUploadPage />;
}
