"use client";

import { useState } from "react";
import StepRoute from "@/components/quote/StepRoute";
import StepVehicle from "@/components/quote/StepVehicle";
import StepContact from "@/components/quote/StepContact";
export type QuoteData = {
  // route
  fromCity?: string;
  toCity?: string;
  transportType?: string;
  collectionDateType?: string;
  collectionDate?: string;

  // vehicle
  vehicleType?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleCondition?: string;

  // contact
  fullName?: string;
  email?: string;
  phone?: string;
  customerType?: string;
  notes?: string;

  // pricing
  quotedPrice?: number;

  // system
  submittedAt?: string;
};

export default function QuoteWizard() {
  const [step, setStep] = useState(1);

  const [data, setData] = useState<QuoteData>({});

  function next(values: Partial<QuoteData>) {
    setData((prev) => ({ ...prev, ...values }));
    setStep((s) => s + 1);
  }

  function back() {
    setStep(step - 1);
  }

  return (
    <div className="bg-white p-10 rounded-xl shadow">
      {/* progress bar */}
      <div className="flex justify-between mb-10 text-sm font-medium">
        <span className={step >= 1 ? "text-black" : "text-gray-400"}>
          Route
        </span>
        <span className={step >= 2 ? "text-black" : "text-gray-400"}>
          Vehicle
        </span>
        <span className={step >= 3 ? "text-black" : "text-gray-400"}>
          Contact
        </span>
      </div>

      {step === 1 && <StepRoute next={next} data={data} />}

      {step === 2 && <StepVehicle next={next} back={back} data={data} />}

      {step === 3 && <StepContact next={next} back={back} data={data} />}
    </div>
  );
}
