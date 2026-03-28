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

export default function RouteEstimateSection() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  const router = useRouter();

  /* ---------------------------
  Fetch routes
  ----------------------------*/
  useEffect(() => {
    async function fetchRoutes() {
      const res = await fetch("/api/routes"); // 👈 you need this endpoint
      const data = await res.json();
      setRoutes(data);
    }

    fetchRoutes();
  }, []);

  /* ---------------------------
  Unique cities
  ----------------------------*/
  const cities = Array.from(
    new Set(
      routes.flatMap((r) => [r.fromCity?.name, r.toCity?.name]).filter(Boolean),
    ),
  );

  /* ---------------------------
  Handle submit
  ----------------------------*/
  function handleSubmit() {
    if (!fromCity || !toCity) return;

    const match = routes.find(
      (r) => r.fromCity?.name === fromCity && r.toCity?.name === toCity,
    );

    if (match?.slug?.current) {
      router.push(`/vehicle-transport/${match.slug.current}`);
    } else {
      // fallback → go to quote page
      router.push(
        `/get-a-quote?fromCity=${encodeURIComponent(fromCity)}&toCity=${encodeURIComponent(toCity)}`,
      );
    }
  }

  return (
    <section className="bg-[#311d60] py-16 text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Get Your Vehicle Transport Estimate
        </h2>

        <p className="text-white/80 mb-10 max-w-xl mx-auto">
          Select your route and get an instant estimate in seconds. No
          obligation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-lg">
          {/* FROM */}
          <select
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            className="p-3 rounded-lg text-gray-900 border"
          >
            <option value="">From City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* TO */}
          <select
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            className="p-3 rounded-lg text-gray-900 border"
          >
            <option value="">To City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            className="bg-[#311d60] text-white rounded-lg px-6 py-3 font-semibold hover:opacity-90 transition"
          >
            View Route
          </button>
        </div>
        {/* 🔥 PREMIUM AI SUGGESTIONS */}
        <div className="md:col-span-3">
          <div className="flex flex-col items-center gap-3 mb-2">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Smart suggestions
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() =>
                  router.push(
                    "/get-a-quote?fromCity=Johannesburg&toCity=Cape%20Town&vehicleType=suv",
                  )
                }
                className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 transition"
              >
                SUV Joburg → Cape Town
              </button>

              <button
                onClick={() =>
                  router.push(
                    "/get-a-quote?fromCity=Durban&toCity=Pretoria&vehicleType=bakkie",
                  )
                }
                className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 transition"
              >
                Bakkie Durban → Pretoria
              </button>

              <button
                onClick={() =>
                  router.push(
                    "/get-a-quote?fromCity=Cape%20Town&toCity=Johannesburg&vehicleType=sedan",
                  )
                }
                className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 transition"
              >
                Sedan Cape Town → Joburg
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
