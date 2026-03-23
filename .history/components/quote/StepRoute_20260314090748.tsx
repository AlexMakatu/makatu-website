"use client";

import { useState } from "react";
import { QuoteData } from "@/app/get-a-quote/page";

type Props = {
  next: (values: Partial<QuoteData>) => void;
};

export default function StepRoute({ next }: Props) {
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
      <div>
        <label className="block font-medium mb-2">From City</label>

        <input
          value={fromCity}
          onChange={(e) => setFromCity(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">To City</label>

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
