"use client";

import { useState, useEffect } from "react";
import { QuoteData } from "@/app/get-a-quote/page";

type Props = {
  next: (values: Partial<QuoteData>) => void;
  data: QuoteData;
};

type City = {
  _id: string;
  name: string;
};

export default function StepRoute({ next, data }: Props) {
  const [fromCity, setFromCity] = useState(data.fromCity || "");
  const [toCity, setToCity] = useState(data.toCity || "");
  const [cities, setCities] = useState<City[]>([]);
  const [pickupResults, setPickupResults] = useState<City[]>([]);
  const [deliveryResults, setDeliveryResults] = useState<City[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  useEffect(() => {
    async function loadCities() {
      const res = await fetch("/api/cities");
      const result = await res.json();
      setCities(result);
    }

    loadCities();
  }, []);

  function searchCities(query: string, type: "pickup" | "delivery") {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  const timeout = setTimeout(() => {
    if (!query) {
      if (type === "pickup") setPickupResults([]);
      else setDeliveryResults([]);
      return;
    }

    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );

    if (type === "pickup") setPickupResults(filtered);
    else setDeliveryResults(filtered);
  }, 250);

  setSearchTimeout(timeout);
}

    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(query.toLowerCase()),
    );

    if (type === "pickup") setPickupResults(filtered);
    else setDeliveryResults(filtered);
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    next({
      fromCity,
      toCity,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Where should we transport your vehicle?
        </h2>

        <p className="text-gray-500 text-sm">
          Enter the pickup and delivery locations to start your quote.
        </p>
      </div>

      {/* Pickup City */}
      <div className="relative">
        <label className="block font-medium mb-2">Pickup City</label>

        <input
          value={fromCity}
          onChange={(e) => {
            setFromCity(e.target.value);
            searchCities(e.target.value, "pickup");
          }}
          placeholder="e.g. Johannesburg"
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        {pickupResults.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow">
            {pickupResults.map((city) => (
              <div
                key={city._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setFromCity(city.name);
                  setPickupResults([]);
                }}
              >
                {city.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delivery City */}
      {/* Delivery City */}
      <div className="relative">
        <label className="block font-medium mb-2">Delivery City</label>

        <input
          value={toCity}
          onChange={(e) => {
            setToCity(e.target.value);
            searchCities(e.target.value, "delivery");
          }}
          placeholder="e.g. Cape Town"
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        {deliveryResults.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow">
            {deliveryResults.map((city) => (
              <div
                key={city._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setToCity(city.name);
                  setDeliveryResults([]);
                }}
              >
                {city.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Continue
      </button>
    </form>
  );
}
