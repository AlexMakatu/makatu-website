"use client";

import { useEffect, useState } from "react";

type City = {
  _id: string;
  name: string;
};

function CityInput({
  label,
  value,
  onChange,
  cities,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  cities: City[];
}) {
  const [query, setQuery] = useState(value);
  const [filtered, setFiltered] = useState<City[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!query) {
      setFiltered([]);
      return;
    }

    const results = cities.filter((city) =>
      city.name.toLowerCase().includes(query.toLowerCase()),
    );

    setFiltered(results.slice(0, 6));
  }, [query, cities]);

  return (
    <div className="relative">
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>

      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        placeholder="Start typing city..."
        className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#311d60]"
      />

      {/* Dropdown */}
      {showDropdown && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto">
          {filtered.map((city) => (
            <div
              key={city._id}
              onClick={() => {
                setQuery(city.name);
                onChange(city.name);
                setShowDropdown(false);
              }}
              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              {city.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
          Plan your vehicle transport
        </p>
      </div>

      {/* INPUTS */}
      <div className="grid gap-3">
        <CityInput
          label="Origin"
          value={fromCity}
          onChange={setFromCity}
          cities={cities}
        />

        <CityInput
          label="Destination"
          value={toCity}
          onChange={setToCity}
          cities={cities}
        />
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
