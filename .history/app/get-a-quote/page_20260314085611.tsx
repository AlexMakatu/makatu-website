"use client";

import { useState } from "react";
import StepRoute from "./StepRoute";
import StepVehicle from "./StepVehicle";
import StepContact from "./StepContact";

export type QuoteData = {
  fromCity?: string;
  toCity?: string;
  vehicleType?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export default function QuoteWizard() {
  const [step, setStep] = useState(1);

  const [data, setData] = useState<QuoteData>({});

  function next(values: Partial<QuoteData>) {
    setData((prev) => ({ ...prev, ...values }));
    setStep(step + 1);
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

      {step === 1 && <StepRoute next={next} />}

      {step === 2 && <StepVehicle next={next} back={back} />}

      {step === 3 && <StepContact data={data} back={back} />}
    </div>
  );
}
