"use client";

import { useState } from "react";
import { QuoteData } from "@/app/get-a-quote/page";

type Props = {
  next: (values: Partial<QuoteData>) => void;
  back: () => void;
  data: QuoteData;
};

export default function StepVehicle({ next, back }: Props) {
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [estimate, setEstimate] = useState<string | null>(null);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    next({
      vehicleType,
      vehicleMake,
      vehicleModel,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* VEHICLE TYPE */}
      <div>
        <label className="block font-medium mb-2">Vehicle Type</label>

        <select
          required
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        >
          <option value="">Select vehicle</option>
          <option value="hatchback">Hatchback</option>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="bakkie">Bakkie</option>
          <option value="van">Van</option>
        </select>
      </div>

      {/* VEHICLE MAKE */}
      <div>
        <label className="block font-medium mb-2">Vehicle Make</label>

        <input
          required
          value={vehicleMake}
          onChange={(e) => setVehicleMake(e.target.value)}
          placeholder="Toyota, Ford, BMW..."
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      {/* VEHICLE MODEL */}
      <div>
        <label className="block font-medium mb-2">Vehicle Model</label>

        <input
          required
          value={vehicleModel}
          onChange={(e) => setVehicleModel(e.target.value)}
          placeholder="Hilux, Ranger, Polo..."
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={back}
          className="border px-6 py-3 rounded-lg"
        >
          Back
        </button>

        <button className="bg-black text-white px-6 py-3 rounded-lg">
          Continue
        </button>
      </div>
    </form>
  );
}
