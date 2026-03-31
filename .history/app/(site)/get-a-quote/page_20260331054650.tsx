import type { Metadata } from "next";
import { Suspense } from "react";
import QuoteWizard from "@/components/quote/QuoteWizard";

type Props = {
  searchParams: {
    fromCity?: string;
    toCity?: string;
    vehicleType?: string;
  };
};

/* --------------------------
SEO (DYNAMIC)
--------------------------- */
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams; // ✅ REQUIRED

  const from = params.fromCity;
  const to = params.toCity;

  const baseTitle = "Get a Vehicle Transport Quote | Makatu";
  const baseDescription =
    "Get an instant vehicle transport quote across South Africa.";

  if (from && to) {
    return {
      title: `Vehicle Transport from ${from} to ${to} | Makatu`,
      description: `Get a fast vehicle transport quote from ${from} to ${to}.`,
      alternates: {
        canonical: "/get-a-quote",
      },
    };
  }

  return {
    title: baseTitle,
    description: baseDescription,
    alternates: {
      canonical: "/get-a-quote",
    },
  };
}
/* --------------------------
PAGE
--------------------------- */
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuoteWizard />
    </Suspense>
  );
}
