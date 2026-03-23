"use client";

import { useState } from "react";

type City = {
  name?: string;
};

type Props = {
  cities?: City[];
};

export default function QuoteForm({ cities }: Props) {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  return (
    <form className="grid gap-6">
      {/* PICKUP CITY */}

      <select
        name="fromCity"
        value={fromCity}
        onChange={(e) => setFromCity(e.target.value)}
        className="border p-3 rounded-lg"
      >
        <option value="">Pickup City</option>

        {cities?.map((city, index) => (
          <option key={index} value={city.name}>
            {city.name}
          </option>
        ))}

        <option value="other">Other</option>
      </select>

      {fromCity === "other" && (
        <input
          type="text"
          name="fromCityCustom"
          placeholder="Enter pickup city"
          className="border p-3 rounded-lg"
        />
      )}

      {/* DELIVERY CITY */}

      <select
        name="toCity"
        value={toCity}
        onChange={(e) => setToCity(e.target.value)}
        className="border p-3 rounded-lg"
      >
        <option value="">Delivery City</option>

        {cities?.map((city, index) => (
          <option key={index} value={city.name}>
            {city.name}
          </option>
        ))}

        <option value="other">Other</option>
      </select>

      {toCity === "other" && (
        <input
          type="text"
          name="toCityCustom"
          placeholder="Enter delivery city"
          className="border p-3 rounded-lg"
        />
      )}
    </form>
  );
}
