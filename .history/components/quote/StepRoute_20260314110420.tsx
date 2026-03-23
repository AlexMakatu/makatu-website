"use client";

import { useState, useEffect } from "react";
import { QuoteData } from "@/app/get-a-quote/page";

type Props = {
  next: (values: Partial<QuoteData>) => void;
  data: QuoteData;
};

export default function StepRoute({ next, data }: Props) {
  const [fromCity, setFromCity] = useState(data.fromCity || "");
  const [toCity, setToCity] = useState(data.toCity || "");
  const [cities, setCities] = useState<{ _id: string; name: string }[]>([]);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    next({
      fromCity,
      toCity,
    });
  }
  useEffect(() => {
    async function loadCities() {
      const res = await fetch("/api/cities");
      const data = await res.json();
      setCities(data);
    }

    loadCities();
  }, []);
  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Where should we transport your vehicle?
        </h2>

        <p className="text-gray-500 text-sm">
          Enter the pickup and delivery locations to start your quote.
        </p>
      </div>

      {/* Pickup */}
      <div>
        <label className="block font-medium mb-2">Pickup City</label>
        <select
          value={fromCity}
          onChange={(e) => setFromCity(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          required
        >
          <option value="">Select pickup city</option>

          {cities.map((city) => (
            <option key={city._id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Delivery */}
      <div>
        <label className="block font-medium mb-2">Delivery City</label>

        <input
          type="text"
          value={toCity}
          onChange={(e) => setToCity(e.target.value)}
          placeholder="e.g. Cape Town"
          className="w-full border rounded-lg px-4 py-3"
          required
        />
      </div>

      {/* Continue */}
      <button
        type="submit"
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Continue
      </button>
    </form>
  );
}
