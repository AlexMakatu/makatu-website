"use client";

import { useState } from "react";
import { Suspense } from "react";
import QuoteWizard from "@/components/quote/QuoteWizard";
import AIInputTest from "@/components/AIInputTest";

type AIResult = {
  fromCity?: string;
  toCity?: string;
  vehicleType?: string;
};

export default function Page() {
  const [aiData, setAIData] = useState<AIResult | null>(null);

  return (
    <div className="space-y-6">
      {/* AI Input */}
      <AIInputTest onResult={setAIData} />

      {/* Existing Quote Flow */}
      <Suspense fallback={<div>Loading...</div>}>
        <QuoteWizard />
      </Suspense>
    </div>
  );
}
