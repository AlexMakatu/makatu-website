"use client";

import { useState } from "react";

export default function QuoteForm() {
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

      <input
        type="text"
        name="fromCity"
        placeholder="Pickup City"
        required
        className="border p-3 rounded-lg"
      />

      <input
        type="text"
        name="toCity"
        placeholder="Delivery City"
        required
        className="border p-3 rounded-lg"
      />

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
