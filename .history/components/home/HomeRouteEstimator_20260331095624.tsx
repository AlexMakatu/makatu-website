"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type City = {
  _id: string;
  name: string;
};

type Estimate = {
  price?: number;
  priceType?: string;
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
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = query
    ? cities
        .filter((city) => city.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6)
    : [];

  return (
    <div className="relative">
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>

      <input
        value={query}
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);
          onChange(val);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        placeholder="Enter city"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#311d60]"
      />

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
              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
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
  const router = useRouter();

  const [cities, setCities] = useState<City[]>([]);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [aiInput, setAiInput] = useState("");

  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      const res = await fetch("/api/cities");
      const data: City[] = await res.json();
      setCities(data);
    }
    fetchCities();
  }, []);

  async function handleAI() {
    if (!aiInput) return;

    setLoading(true);

    try {
      const res = await fetch("/api/ai-parse", {
        method: "POST",
        body: JSON.stringify({ message: aiInput }),
      });

      const parsed = await res.json();

      const params = new URLSearchParams();

      if (parsed.fromCity) params.set("fromCity", parsed.fromCity);
      if (parsed.toCity) params.set("toCity", parsed.toCity);
      if (parsed.vehicleType) params.set("vehicleType", parsed.vehicleType);
      if (parsed.vehicleMake) params.set("vehicleMake", parsed.vehicleMake);
      if (parsed.vehicleModel) params.set("vehicleModel", parsed.vehicleModel);

      router.push(`/get-a-quote?${params.toString()}`);
    } catch (err) {
      console.error("AI error", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!fromCity || !toCity) return;

    setLoading(true);
    setEstimate(null);

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        body: JSON.stringify({
          fromCity,
          toCity,
        }),
      });

      const data: Estimate | null = await res.json();

      if (data?.price) {
        setEstimate(data);
        setLoading(false);
        return;
      }

      goToQuote();
    } catch {
      goToQuote();
    }
  }

  function goToQuote() {
    const params = new URLSearchParams({
      fromCity,
      toCity,
    });

    router.push(`/get-a-quote?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
          Move your vehicle
        </p>
        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
          Where should we collect and deliver?
        </h3>
      </div>

      {/* 🔥 AI INPUT */}
      <div className="space-y-3">
        <input
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          placeholder="SUV Joburg → Cape Town"
          className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#311d60]"
        />

        <button
          onClick={handleAI}
          className="w-full py-3 rounded-xl text-sm font-medium bg-[#311d60] text-white hover:bg-[#2a1854] transition"
        >
          {loading ? "Processing..." : "Quick Estimate ⚡"}
        </button>

        <p className="text-xs text-gray-400 text-center">or enter manually</p>
      </div>

      {/* INPUTS */}
      <div className="grid gap-3">
        <CityInput
          label="Collection"
          value={fromCity}
          onChange={setFromCity}
          cities={cities}
        />

        <CityInput
          label="Delivery"
          value={toCity}
          onChange={setToCity}
          cities={cities}
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={!fromCity || !toCity || loading}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition ${
          fromCity && toCity
            ? "bg-gray-900 hover:bg-black text-white"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        {loading ? "Checking route..." : "Continue →"}
      </button>

      {/* ESTIMATE */}
      {estimate && (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm">
          <p className="text-gray-500">
            {fromCity} → {toCity}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            R {estimate.price}
          </p>

          <button
            onClick={goToQuote}
            className="mt-3 text-sm font-medium text-[#311d60] underline"
          >
            Continue with this route →
          </button>
        </div>
      )}
    </div>
  );
}
