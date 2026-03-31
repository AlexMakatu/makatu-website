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

  const searchParams = useSearchParams();

  // ✅ EXISTING PARAMS
  const fromCityParam = searchParams.get("fromCity");
  const toCityParam = searchParams.get("toCity");
  const vehicleTypeParam = searchParams.get("vehicleType");

  // ✅ NEW PARAMS (THIS WAS MISSING)
  const vehicleMakeParam = searchParams.get("vehicleMake");
  const vehicleModelParam = searchParams.get("vehicleModel");

  useEffect(() => {
    if (!fromCityParam && !toCityParam && !vehicleTypeParam) return;

    setData((prev) => ({
      ...prev,
      fromCity: prev.fromCity || fromCityParam || "",
      toCity: prev.toCity || toCityParam || "",

      // ✅ FIXED VEHICLE SETUP
      vehicles: prev.vehicles?.length
        ? prev.vehicles
        : vehicleTypeParam
          ? [
              {
                vehicleType: vehicleTypeParam,
                vehicleMake: vehicleMakeParam || "",
                vehicleModel: vehicleModelParam || "",
                vehicleYear: "",
                vehicleCondition: "runner",
              },
            ]
          : prev.vehicles,
    }));

    // ✅ FIXED STEP FLOW (DON'T SKIP VEHICLE STEP)
    if (fromCityParam && toCityParam && vehicleTypeParam) {
      setStep(2); // go to Vehicle step so user sees autofill
    }
  }, [
    fromCityParam,
    toCityParam,
    vehicleTypeParam,
    vehicleMakeParam,
    vehicleModelParam,
  ]);

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

        const result: { success: boolean; message?: string } = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Submit failed");
        }

        window.location.href = "/quote-success";

        setStep(1);
        setData({});
      } catch (error) {
        console.error("Submit error:", error);

        alert(
          error instanceof Error
            ? error.message
            : "Something went wrong submitting your quote.",
        );
      }

      return;
    }

    setStep((s) => s + 1);
  }

  function back() {
    setStep((s) => s - 1);
  }

  return (
    <section className="px-4 sm:px-6 py-4 sm:py-8 bg-gray-50 min-h-[80vh] flex items-start justify-center">
      <div className="max-w-2xl w-full bg-white p-4 sm:p-6 rounded-2xl shadow-sm border">
        {/* HEADER */}
        <div className="text-center mb-5">
          <h1 className="text-xl sm:text-3xl font-semibold text-[#311d60] mb-1">
            Get a Quote
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Fast vehicle transport pricing across South Africa
          </p>
        </div>

        {/* ROUTE SUMMARY */}
        {data.fromCity && data.toCity && (
          <div className="mb-4 text-sm text-gray-500 text-center">
            {data.fromCity} → {data.toCity}
          </div>
        )}

        {/* PROGRESS */}
        <div className="flex justify-between mb-6 text-xs sm:text-sm font-medium">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center gap-2">
              <span
                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full font-semibold ${
                  step >= num
                    ? "bg-[#311d60] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {num}
              </span>
              <span
                className={step >= num ? "text-[#311d60]" : "text-gray-400"}
              >
                {num === 1 ? "Route" : num === 2 ? "Vehicle" : "Contact"}
              </span>
            </div>
          ))}
        </div>

        {/* STEPS */}
        <div className="transition-all duration-300">
          {step === 1 && <StepRoute next={next} data={data} />}
          {step === 2 && <StepVehicle next={next} back={back} data={data} />}
          {step === 3 && <StepContact next={next} back={back} data={data} />}
        </div>
      </div>
    </section>
  );
}
