"use client";

import { useState } from "react";

type AIResult = {
  fromCity?: string;
  toCity?: string;
  vehicleType?: string;
};

type Props = {
  onResult: (data: AIResult) => void;
};

export default function AIInputTest({ onResult }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input) return;

    setLoading(true);

    try {
      const res = await fetch("/api/ai-parse", {
        method: "POST",
        body: JSON.stringify({ message: input }),
      });

      const data: unknown = await res.json();

      if (typeof data === "object" && data !== null) {
        const parsed = data as AIResult;

        const params = new URLSearchParams();

        if (parsed.fromCity) params.set("fromCity", parsed.fromCity);
        if (parsed.toCity) params.set("toCity", parsed.toCity);

        window.location.href = `/get-a-quote?${params.toString()}`;
      }
    } catch (error) {
      console.error("AI error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto border rounded-lg bg-white">
      <p className="text-sm text-gray-500 mb-2">
        Get an instant estimate — just type your route:
      </p>

      <input
        className="w-full border p-3 rounded mb-3"
        placeholder="e.g. Move my SUV from Joburg to Cape Town"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Processing..." : "Get Estimate"}
      </button>
    </div>
  );
}
