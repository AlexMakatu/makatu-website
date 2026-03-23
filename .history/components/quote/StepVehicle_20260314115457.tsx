"use client";

import { useState } from "react";
import { QuoteData } from "@/app/get-a-quote/page";

type Vehicle = {
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
};

type Props = {
  next: (values: Partial<QuoteData>) => void;
  back: () => void;
  data: QuoteData;
};

export default function StepVehicle({ next, back, data }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      vehicleType: data.vehicleType || "",
      vehicleMake: data.vehicleMake || "",
      vehicleModel: data.vehicleModel || "",
    },
  ]);

  const [estimate, setEstimate] = useState<number | null>(null);

  async function getEstimate(vehicleType: string) {
    if (!vehicleType || !data.fromCity || !data.toCity) return;

    const res = await fetch(
      `/api/estimate?from=${data.fromCity}&to=${data.toCity}&vehicle=${vehicleType}`,
    );

    if (!res.ok) return;

    const result = await res.json();

    if (result?.price) {
      setEstimate(result.price);
    }
  }

  function updateVehicle(index: number, field: keyof Vehicle, value: string) {
    const updated = [...vehicles];
    updated[index][field] = value;
    setVehicles(updated);

    if (field === "vehicleType") {
      getEstimate(value);
    }
  }

  function addVehicle() {
    setVehicles([
      ...vehicles,
      {
        vehicleType: "",
        vehicleMake: "",
        vehicleModel: "",
      },
    ]);
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    next({
      vehicleType: vehicles[0].vehicleType,
      vehicleMake: vehicles[0].vehicleMake,
      vehicleModel: vehicles[0].vehicleModel,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {vehicles.map((vehicle, index) => (
        <div key={index} className="space-y-6 border-b pb-6">
          <h3 className="font-semibold">Vehicle {index + 1}</h3>

          {/* VEHICLE TYPE */}
          <div>
            <label className="block font-medium mb-2">Vehicle Type</label>

            <select
              required
              value={vehicle.vehicleType}
              onChange={(e) =>
                updateVehicle(index, "vehicleType", e.target.value)
              }
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

          {/* PRICE ESTIMATE */}
          {estimate && index === 0 && (
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-500">Estimated transport price</p>

              <p className="text-xl font-semibold">
                R{estimate.toLocaleString()}
              </p>
            </div>
          )}

          {/* VEHICLE MAKE */}
          <div>
            <label className="block font-medium mb-2">Vehicle Make</label>

            <input
              required
              value={vehicle.vehicleMake}
              onChange={(e) =>
                updateVehicle(index, "vehicleMake", e.target.value)
              }
              placeholder="Toyota, Ford, BMW..."
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* VEHICLE MODEL */}
          <div>
            <label className="block font-medium mb-2">Vehicle Model</label>

            <input
              required
              value={vehicle.vehicleModel}
              onChange={(e) =>
                updateVehicle(index, "vehicleModel", e.target.value)
              }
              placeholder="Hilux, Ranger, Polo..."
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        </div>
      ))}

      {/* ADD VEHICLE BUTTON */}
      <button
        type="button"
        onClick={addVehicle}
        className="text-blue-600 font-medium"
      >
        + Add another vehicle
      </button>

      {/* NAV BUTTONS */}
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
