"use client";

import { useState } from "react";

type City = {
  name?: string;
};

type Props = {
  cities?: City[];
};

export default function QuoteForm({ cities }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    console.log(data);

    alert("Quote request submitted!");

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        required
        className="border p-3 rounded-lg"
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        required
        className="border p-3 rounded-lg"
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        required
        className="border p-3 rounded-lg"
      />

      <input
        type="text"
        name="vehicle"
        placeholder="Vehicle Type"
        className="border p-3 rounded-lg"
      />

      {/* PICKUP CITY */}

      <select name="fromCity" required className="border p-3 rounded-lg">
        <option value="">Pickup City</option>

        {cities?.map((city, index) => (
          <option key={index} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>

      {/* DELIVERY CITY */}

      <select name="toCity" required className="border p-3 rounded-lg">
        <option value="">Delivery City</option>

        {cities?.map((city, index) => (
          <option key={index} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>

      <textarea
        name="message"
        placeholder="Additional details"
        rows={4}
        className="border p-3 rounded-lg"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
      >
        {loading ? "Submitting..." : "Request Quote"}
      </button>
    </form>
  );
}
