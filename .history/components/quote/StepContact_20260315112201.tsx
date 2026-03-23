"use client";

import { useState, useEffect } from "react";
import { QuoteData } from "@/app/(site)/get-a-quote/page";

type Props = {
  next: (values: Partial<QuoteData>) => void;
  back: () => void;
  data: QuoteData;
};

export default function StepContact({ next, back, data }: Props) {
  const [name, setName] = useState(data.fullName || "");
  const [email, setEmail] = useState(data.email || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [notes, setNotes] = useState(data.notes || "");
  const [priceToBeat, setPriceToBeat] = useState<number | undefined>(
    data.priceToBeat,
  );

  const [estimate, setEstimate] = useState<number | null>(null);

  useEffect(() => {
    async function fetchEstimate() {
      if (!data.fromCity || !data.toCity || !data.vehicles?.length) return;

      let total = 0;

      for (const vehicle of data.vehicles) {
        const res = await fetch(
          `/api/estimate?from=${data.fromCity}&to=${data.toCity}&vehicle=${vehicle.vehicleType}`,
        );

        const result = await res.json();

        if (result?.price) {
          total += result.price;
        }
      }

      setEstimate(total);
    }

    fetchEstimate();
  }, [data]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    next({
      fullName: name,
      email,
      phone,
      priceToBeat,
      notes,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Price Summary */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <p className="text-sm text-gray-500">Estimated Transport Price</p>

        <p className="text-2xl font-semibold">
          {estimate ? `R${estimate}` : "Calculating..."}
        </p>
      </div>

      {/* Price to Beat */}
      <div>
        <label className="block font-medium mb-2">
          Do you have a price to beat? (optional)
        </label>

        <input
          type="number"
          value={priceToBeat || ""}
          onChange={(e) => setPriceToBeat(Number(e.target.value))}
          placeholder="e.g. 1800"
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      {/* Full Name */}
      <div>
        <label className="block font-medium mb-2">Full Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Smith"
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block font-medium mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@email.com"
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block font-medium mb-2">Phone</label>
        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+27 82 123 4567"
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block font-medium mb-2">Additional Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything we should know about the vehicle?"
          className="w-full border rounded-lg px-4 py-3 h-24"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={back}
          className="border px-6 py-3 rounded-lg"
        >
          Back
        </button>

        <button className="bg-black text-white px-6 py-3 rounded-lg">
          Submit Quote
        </button>
      </div>
    </form>
  );
}
