"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type City = {
  _id: string;
  name: string;
};

export default function RouteEstimateSection() {
  const [cities, setCities] = useState<City[]>([]);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  const router = useRouter();

  /* ---------------------------
  Fetch cities
  ----------------------------*/
  useEffect(() => {
    async function fetchCities() {
      const res = await fetch("/api/cities");
      const data = await res.json();
      setCities(data);
    }

    fetchCities();
  }, []);

  /* ---------------------------
  Handle submit
  ----------------------------*/
  function handleSubmit() {
    if (!fromCity || !toCity) return;

    router.push(
      `/get-a-quote?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}`,
    );
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

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-lg">
          {/* FROM */}
          <select
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            className="p-3 rounded-lg text-gray-900 border"
          >
            <option value="">From City</option>
            {cities.map((city) => (
              <option key={city._id} value={city.name}>
                {city.name}
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
              <option key={city._id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            className="bg-[#311d60] text-white rounded-lg px-6 py-3 font-semibold hover:opacity-90 transition"
          >
            Get Estimate
          </button>
        </div>
      </div>
    </section>
  );
}
