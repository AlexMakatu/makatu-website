"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import StepRoute from "@/components/quote/StepRoute";
import StepVehicle from "@/components/quote/StepVehicle";
import StepContact from "@/components/quote/StepContact";

export type QuoteData = {
  fromCity?: string;
  toCity?: string;
  transportType?: string;
  collectionDateType?: string;
  collectionDate?: string;

  vehicles?: {
    vehicleType: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear?: string;
    vehicleCondition?: string;
  }[];

  fullName?: string;
  email?: string;
  phone?: string;
  customerType?: string;

  priceToBeat?: number;

  notes?: string;

  quotedPrice?: number;
  submittedAt?: string;
};

export default function QuoteWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuoteData>({});
  const [vehicleTypes, setVehicleTypes] = useState<{ title: string }[]>([]);
  /* 🔥 NEW: Read URL params */
  const searchParams = useSearchParams();

  const fromCityParam = searchParams.get("fromCity");
  const toCityParam = searchParams.get("toCity");

  /* 🔥 NEW: Inject params into state */
  useEffect(() => {
    if (!fromCityParam && !toCityParam) return;

    setData((prev) => ({
      ...prev,
      fromCity: prev.fromCity || fromCityParam || "",
      toCity: prev.toCity || toCityParam || "",
    }));
  }, [fromCityParam, toCityParam]);

  async function next(values: Partial<QuoteData>) {
    const updated = { ...data, ...values };

    setData(updated);

    if (step === 3) {
      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...updated,
            submittedAt: new Date().toISOString(),
          }),
        });

        if (!res.ok) throw new Error("Submit failed");

        window.location.href = "/quote-success";
        setStep(1);
        setData({});
      } catch (error) {
        console.error(error);
        alert("Something went wrong submitting your quote.");
      }

      return;
    }

    setStep((s) => s + 1);
  }

  function back() {
    setStep((s) => s - 1);
  }

  return (
    <section className="px-6 py-8 bg-gray-50 min-h-screen flex items-start justify-center">
      <div className="max-w-3xl w-full bg-white p-6 rounded-xl shadow border">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#311d60] mb-2">
            Get a Quote
          </h1>
          <p className="text-gray-500 text-sm">
            Fast vehicle transport pricing across South Africa
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-6 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span
              className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold ${
                step >= 1
                  ? "bg-[#311d60] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </span>
            <span className={step >= 1 ? "text-[#311d60]" : "text-gray-400"}>
              Route
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold ${
                step >= 2
                  ? "bg-[#311d60] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </span>
            <span className={step >= 2 ? "text-[#311d60]" : "text-gray-400"}>
              Vehicle
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold ${
                step >= 3
                  ? "bg-[#311d60] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </span>
            <span className={step >= 3 ? "text-[#311d60]" : "text-gray-400"}>
              Contact
            </span>
          </div>
        </div>

        {/* Steps */}
        {step === 1 && <StepRoute next={next} data={data} />}
        {step === 2 && <StepVehicle next={next} back={back} data={data} />}
        {step === 3 && <StepContact next={next} back={back} data={data} />}
      </div>
    </section>
  );
}
