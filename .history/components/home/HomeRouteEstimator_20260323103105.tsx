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
    <section className="bg-white -mt-12 relative z-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Floating Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 text-center">
            Find Your Route
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* FROM */}
            <select
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="p-3 rounded-lg border text-gray-900"
            >
              <option value="">From City</option>
              {cities.map((city) => (
                <option key={`from-${city}`} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* TO */}
            <select
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className="p-3 rounded-lg border text-gray-900"
            >
              <option value="">To City</option>
              {cities.map((city) => (
                <option key={`to-${city}`} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              className="bg-[#311d60] text-white rounded-lg px-6 py-3 font-semibold hover:opacity-90 transition"
            >
              Check Route
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
