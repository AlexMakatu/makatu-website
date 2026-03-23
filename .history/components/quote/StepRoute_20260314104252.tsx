"use client";

import { useState } from "react";
import { QuoteData } from "@/app/get-a-quote/page";

type Props = {
  next: (values: Partial<QuoteData>) => void;
  data: QuoteData;
};

export default function StepRoute({ next, data }: Props) {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

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
      <div>
        <label className="block font-medium mb-2">Pickup City</label>

        <input
          value={fromCity}
          onChange={(e) => setFromCity(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Delivery City</label>

        <input
          value={toCity}
          onChange={(e) => setToCity(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <button className="bg-black text-white px-6 py-3 rounded-lg">
        Continue
      </button>
    </form>
  );
}
