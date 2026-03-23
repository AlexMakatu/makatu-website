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
  const [vehicles, setVehicles] = useState<Vehicle[]>(
    data.vehicles || [
      {
        vehicleType: "",
        vehicleMake: "",
        vehicleModel: "",
      },
    ],
  );

  function updateVehicle(index: number, field: keyof Vehicle, value: string) {
    const updated = [...vehicles];
    updated[index][field] = value;
    setVehicles(updated);
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
      vehicles,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {vehicles.map((vehicle, index) => (
        <div key={index} className="space-y-6 border-b pb-6">
          <h3 className="font-semibold">Vehicle {index + 1}</h3>

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

      <div className="pt-4">
        <button
          type="button"
          onClick={addVehicle}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-700 hover:bg-gray-50 transition"
        >
          + Add another vehicle
        </button>
      </div>

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
