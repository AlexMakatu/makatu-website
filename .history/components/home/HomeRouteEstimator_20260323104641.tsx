"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Route = {
  slug?: {
    current?: string;
  };
  fromCity?: {
    name?: string;
  };
  toCity?: {
    name?: string;
  };
};

export default function HomeRouteEstimator() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchRoutes() {
      const res = await fetch("/api/routes");
      const data: Route[] = await res.json();
      setRoutes(data);
    }

    fetchRoutes();
  }, []);

  const cities = Array.from(
    new Set(
      routes
        .flatMap((r) => [r.fromCity?.name, r.toCity?.name])
        .filter((c): c is string => typeof c === "string"),
    ),
  );

  function handleSubmit() {
    if (!fromCity || !toCity) return;

    const match = routes.find(
      (r) => r.fromCity?.name === fromCity && r.toCity?.name === toCity,
    );

    if (match?.slug?.current) {
      router.push(`/vehicle-transport/${match.slug.current}`);
    } else {
      router.push(
        `/get-a-quote?fromCity=${encodeURIComponent(fromCity)}&toCity=${encodeURIComponent(toCity)}`,
      );
    }
  }

  return (
    <div className="w-full flex justify-center mt-8">
      <div className="w-full max-w-md bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-6 border border-gray-100">
        {/* Heading */}
        <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
          Where are you moving your vehicle?
        </h2>

        <p className="text-gray-500 text-sm text-center mb-5">
          Get an instant estimate in seconds
        </p>

        {/* Inputs stacked (KEY CHANGE) */}
        <div className="flex flex-col gap-3">
          <select
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            className="p-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#311d60]"
          >
            <option value="">From City</option>
            {cities.map((city) => (
              <option key={`from-${city}`} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            className="p-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#311d60]"
          >
            <option value="">To City</option>
            {cities.map((city) => (
              <option key={`to-${city}`} value={city}>
                {city}
              </option>
            ))}
          </select>

          <button
            onClick={handleSubmit}
            className="bg-[#311d60] text-white rounded-xl py-3 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md mt-2"
          >
            Get Instant Quote →
          </button>
        </div>
      </div>
    </div>
  );
}
