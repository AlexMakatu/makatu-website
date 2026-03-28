import { Suspense } from "react";
import QuoteWizard from "@/components/quote/QuoteWizard";
import AIInputTest from "@/components/AIInputTest"; // adjust path

export default function Page() {
  return (
    <div className="space-y-6">
      {/* AI Input */}
      <AIInputTest />

      {/* Existing Quote Flow */}
      <Suspense fallback={<div>Loading...</div>}>
        <QuoteWizard />
      </Suspense>
    </div>
  );
}
