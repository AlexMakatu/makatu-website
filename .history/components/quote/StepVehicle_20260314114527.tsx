"use client";

import { useState } from "react";
import { QuoteData } from "@/app/get-a-quote/page";

type Props = {
  next: (values: Partial<QuoteData>) => void;
  back: () => void;
  data: QuoteData;
};

export default function StepVehicle({ next, back, data }: Props) {
  const [vehicleType, setVehicleType] = useState(data.vehicleType || "");
  const [vehicleMake, setVehicleMake] = useState(data.vehicleMake || "");
  const [vehicleModel, setVehicleModel] = useState(data.vehicleModel || "");

  const [estimate, setEstimate] = useState<number | null>(null);

  async function getEstimate(vehicle: string) {
    if (!vehicle || !data.fromCity || !data.toCity) return;

    const res = await fetch(
      `/api/estimate?from=${data.fromCity}&to=${data.toCity}&vehicle=${vehicle}`,
    );

    if (!res.ok) return;

    const result = await res.json();

    if (result?.price) {
      setEstimate(result.price);
    } else {
      setEstimate(null);
    }
    console.log("estimate query", data.fromCity, data.toCity, vehicle);
  }

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
          onChange={(e) => {
            const value = e.target.value;
            setVehicleType(value);
            getEstimate(value);
          }}
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

      {/* ESTIMATED PRICE */}
      {estimate !== null && (
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-500">Estimated transport price</p>

          <p className="text-xl font-semibold">R{estimate.toLocaleString()}</p>
        </div>
      )}

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
