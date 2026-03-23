"use client";

import { useState } from "react";

export default function StepRoute({ next }: any) {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  function submit(e: any) {
    e.preventDefault();

    next({
      fromCity,
      toCity,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label className="block font-medium mb-2">Pickup City</label>

        <input
          required
          value={fromCity}
          onChange={(e) => setFromCity(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          placeholder="Start typing city..."
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Delivery City</label>

        <input
          required
          value={toCity}
          onChange={(e) => setToCity(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          placeholder="Start typing city..."
        />
      </div>

      <button className="bg-black text-white px-6 py-3 rounded-lg">
        Continue
      </button>
    </form>
  );
}
