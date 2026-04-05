import type { Metadata } from "next";
import { Suspense } from "react";
import QuoteWizard from "@/components/quote/QuoteWizard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

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
    vehicleMake?: string;
    vehicleModel?: string;
  }>;
}): Promise<Metadata> {
  const params = await searchParams;

  const from = params.fromCity;
  const to = params.toCity;

  const type = params.vehicleType;

  if (from && to && type) {
    return {
      title: `${type.toUpperCase()} Transport from ${from} to ${to} | Makatu`,
      description: `Get a fast ${type} transport quote from ${from} to ${to}. Reliable vehicle transport across South Africa.`,
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
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Get a Quote" }]}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <QuoteWizard />
      </Suspense>
    </>
  );
}
