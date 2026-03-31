import type { Metadata } from "next";
import { Suspense } from "react";
import QuoteWizard from "@/components/quote/QuoteWizard";

/* --------------------------
SEO (DYNAMIC)
--------------------------- */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    fromCity?: string;
    toCity?: string;
    vehicleType?: string;
  }>;
}): Promise<Metadata> {
  const params = await searchParams;

  const from = params.fromCity;
  const to = params.toCity;

  if (from && to) {
    return {
      title: `Vehicle Transport from ${from} to ${to} | Makatu`,
      description: `Get a fast vehicle transport quote from ${from} to ${to}. Reliable car transport across South Africa.`,
      alternates: {
        canonical: "/get-a-quote",
      },
    };
  }

  return {
    title: "Get a Vehicle Transport Quote | Makatu",
    description:
      "Get an instant vehicle transport quote across South Africa. Fast, reliable, and secure car transport services.",
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
