"use client";

import { useState, useEffect } from "react";
import { QuoteData } from "@/components/quote/QuoteWizard";

type Vehicle = {
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear?: string;
  vehicleCondition?: string;
};

type Props = {
  next: (values: Partial<QuoteData>) => void;
  back: () => void;
  data: QuoteData;
};

/**
 * Model → Make + Type mapping (fallback safety layer)
 */
const modelMap: Record<string, { make: string; type: string }> = {
  x3: { make: "BMW", type: "suv" },
  x5: { make: "BMW", type: "suv" },
  hilux: { make: "Toyota", type: "bakkie" },
  ranger: { make: "Ford", type: "bakkie" },
  polo: { make: "Volkswagen", type: "hatchback" },
  corolla: { make: "Toyota", type: "sedan" },
};

export default function StepVehicle({ next, back, data }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(
    data.vehicles && data.vehicles.length > 0
      ? data.vehicles
      : [
          {
            vehicleType: "",
            vehicleMake: "",
            vehicleModel: "",
            vehicleYear: "",
            vehicleCondition: "runner",
          },
        ],
  );
 /t
  useEffect(() => {
    if (data.vehicles && data.vehicles.length > 0) {
      setVehicles(data.vehicles);
    }
  }, [data.vehicles]);
  /**
   * Update vehicle + smart autofill
   */
  function updateVehicle(index: number, field: keyof Vehicle, value: string) {
    const updated = [...vehicles];

    updated[index][field] = value;

    /**
     * 🔥 Auto-detect from MODEL input
     */
    if (field === "vehicleModel") {
      const key = value.toLowerCase().trim();

      if (modelMap[key]) {
        updated[index].vehicleMake = modelMap[key].make;

        // Only set type if user hasn't selected one yet
        if (!updated[index].vehicleType) {
          updated[index].vehicleType = modelMap[key].type;
        }
      }
    }

    /**
     * 🔥 Optional: handle "BMW X3" typed into MAKE field
     */
    if (field === "vehicleMake") {
      const parts = value.trim().split(" ");

      if (parts.length >= 2) {
        const make = parts[0];
        const model = parts.slice(1).join(" ").toLowerCase();

        if (modelMap[model]) {
          updated[index].vehicleMake = make;
          updated[index].vehicleModel = model;

          if (!updated[index].vehicleType) {
            updated[index].vehicleType = modelMap[model].type;
          }
        }
      }
    }

    setVehicles(updated);
  }

  function addVehicle() {
    setVehicles([
      ...vehicles,
      {
        vehicleType: "",
        vehicleMake: "",
        vehicleModel: "",
        vehicleYear: "",
        vehicleCondition: "runner",
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

          {/* Vehicle Type */}
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

          {/* Vehicle Make */}
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

          {/* Vehicle Model */}
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

          {/* Vehicle Year */}
          <div>
            <label className="block font-medium mb-2">Vehicle Year</label>

            <input
              value={vehicle.vehicleYear}
              onChange={(e) =>
                updateVehicle(index, "vehicleYear", e.target.value)
              }
              placeholder="2020"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* Vehicle Condition */}
          <div>
            <label className="block font-medium mb-2">Vehicle Condition</label>

            <select
              value={vehicle.vehicleCondition}
              onChange={(e) =>
                updateVehicle(index, "vehicleCondition", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="runner">Runner</option>
              <option value="nonRunner">Non-Runner</option>
              <option value="forklift">Requires Forklift</option>
            </select>

            {vehicle.vehicleCondition === "nonRunner" && (
              <p className="text-sm text-gray-500 mt-2">
                Non-running vehicles must have inflated tyres, free-turning
                wheels aligned with the steering, and working brakes for
                loading.
              </p>
            )}
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
