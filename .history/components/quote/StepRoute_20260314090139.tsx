"use client";

import { useState } from "react";

export default function StepVehicle({ next, back }: any) {
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");

  function submit(e: any) {
    e.preventDefault();

    next({
      vehicleType,
      vehicleMake,
      vehicleModel,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
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

      <div>
        <label className="block font-medium mb-2">Vehicle Make</label>

        <input
          value={vehicleMake}
          onChange={(e) => setVehicleMake(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Vehicle Model</label>

        <input
          value={vehicleModel}
          onChange={(e) => setVehicleModel(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />
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
