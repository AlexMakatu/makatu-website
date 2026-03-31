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
  const from = searchParams.fromCity;
  const to = searchParams.toCity;

  const baseTitle = "Get a Vehicle Transport Quote | Makatu";
  const baseDescription =
    "Get an instant vehicle transport quote across South Africa. Fast, reliable, and secure car transport services.";

  if (from && to) {
    return {
      title: `Vehicle Transport from ${from} to ${to} | Makatu`,
      description: `Get a fast vehicle transport quote from ${from} to ${to}. Reliable car transport services across South Africa.`,
    };
  }

  return {
    title: baseTitle,
    description: baseDescription,
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
