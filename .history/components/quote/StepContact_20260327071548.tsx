"use client";

import { useState, useEffect } from "react";
import { QuoteData } from "@/components/quote/QuoteWizard";

type Props = {
  next: (values: Partial<QuoteData>) => void;
  back: () => void;
  data: QuoteData;
};

type VehicleEstimate = {
  type: string;
  price: number;
};

export default function StepContact({ next, back, data }: Props) {
  const [name, setName] = useState(data.fullName || "");
  const [email, setEmail] = useState(data.email || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [notes, setNotes] = useState(data.notes || "");
  const [priceToBeat, setPriceToBeat] = useState<number | undefined>(
    data.priceToBeat,
  );

  const [breakdown, setBreakdown] = useState<VehicleEstimate[]>([]);
  const [subtotal, setSubtotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // VAT calculations
  const vat = subtotal ? subtotal * 0.15 : null;
  const totalWithVat = subtotal && vat ? subtotal + vat : null;

  useEffect(() => {
    async function fetchEstimate() {
      if (!data.fromCity || !data.toCity || !data.vehicles?.length) return;

      setLoading(true);

      const results: VehicleEstimate[] = [];
      let total = 0;

      for (const vehicle of data.vehicles) {
        try {
          const res = await fetch(
            `/api/estimate?from=${data.fromCity}&to=${data.toCity}&vehicle=${vehicle.vehicleType}`,
          );

          const result: { price?: number } = await res.json();

          if (result?.price) {
            results.push({
              type: vehicle.vehicleType,
              price: result.price,
            });

            total += result.price;
          }
        } catch (error) {
          console.error("Estimate fetch failed", error);
        }
      }

      setBreakdown(results);
      setSubtotal(results.length ? total : null);
      setLoading(false);
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
      <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
        <p className="text-sm text-gray-500">Estimated Transport Price</p>

        {loading && <p>Calculating...</p>}

        {!loading && breakdown.length > 0 && (
          <>
            {/* Breakdown */}
            <div className="space-y-1 text-sm">
              {breakdown.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                  <span>R{item.price}</span>
                </div>
              ))}
            </div>

            <hr className="my-2" />

            {/* Subtotal */}
            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>R{subtotal}</span>
            </div>

            {/* VAT */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>VAT (15%)</span>
              <span>R{vat?.toFixed(0)}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>R{totalWithVat?.toFixed(0)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              This is an estimated price based on standard transport rates
              (excl. VAT). Final pricing may vary depending on vehicle
              condition, route availability, and operational factors. Terms &
              conditions apply.
            </p>
          </>
        )}

        {!loading && breakdown.length === 0 && (
          <p>Price unavailable — request quote</p>
        )}
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
