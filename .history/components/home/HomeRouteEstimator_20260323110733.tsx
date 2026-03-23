"use client";

import { useEffect, useState } from "react";

type City = {
  _id: string;
  name: string;
};

export default function HomeRouteEstimator() {
  const [cities, setCities] = useState<City[]>([]);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  useEffect(() => {
    async function fetchCities() {
      const res = await fetch("/api/cities");
      const data: City[] = await res.json();
      setCities(data);
    }
    fetchCities();
  }, []);

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="border-b pb-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Route Planner
        </h3>
        <p className="text-lg font-semibold text-gray-900">
          Where are you moving your vehicle?
        </p>
      </div>

      {/* ROUTE INPUTS */}
      <div className="grid grid-cols-1 gap-3">
        {/* FROM */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Origin</label>
          <select
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#311d60]"
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city._id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* TO */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Destination
          </label>
          <select
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#311d60]"
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city._id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ACTION */}
      <button
        disabled={!fromCity || !toCity}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition ${
          fromCity && toCity
            ? "bg-[#311d60] hover:bg-[#2a1854] text-white"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        Start Transport →
      </button>
    </div>
  );
}
