"use client";

import { Suspense } from "react";
import QuoteWizard from "@/components/quote/QuoteWizard";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuoteWizard />
    </Suspense>
  );
}
