"use client";

import { useState, useEffect } from "react";
import type { QuoteData } from "@/components/quote/QuoteWizard";

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

  const vat = subtotal !== null ? subtotal * 0.15 : null;
  const totalWithVat =
    subtotal !== null && vat !== null ? subtotal + vat : null;

  useEffect(() => {
    async function fetchEstimate() {
      if (!data.fromCity || !data.toCity || !data.vehicles?.length) {
        setBreakdown([]);
        setSubtotal(null);
        return;
      }

      setLoading(true);

      const results: VehicleEstimate[] = [];
      let total = 0;

      for (const vehicle of data.vehicles) {
        try {
          const res = await fetch(
            `/api/estimate?from=${encodeURIComponent(data.fromCity)}&to=${encodeURIComponent(data.toCity)}&vehicle=${encodeURIComponent(vehicle.vehicleType)}`,
          );

          const result: { price?: number } = await res.json();

          if (typeof result.price === "number") {
            results.push({
              type: vehicle.vehicleType,
              price: result.price,
            });

            total += result.price;
          }
        } catch (error: unknown) {
          console.error("Estimate fetch failed", error);
        }
      }

      setBreakdown(results);
      setSubtotal(results.length > 0 ? total : null);
      setLoading(false);
    }

    void fetchEstimate();
  }, [data.fromCity, data.toCity, data.vehicles]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    next({
      fullName: name,
      email,
      phone,
      priceToBeat,
      notes,
      quotedPrice: totalWithVat ?? subtotal ?? undefined,
      quotedPriceType: subtotal !== null ? "fixed" : "quoteRequired",
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
        <p className="text-sm text-gray-500">Estimated Transport Price</p>

        {loading && <p>Calculating...</p>}

        {!loading && (
          <>
            {/* 🔹 ALWAYS SHOW CONTEXT */}
            <div className="space-y-1 text-sm mb-3">
              <p className="text-gray-600">
                {data.fromCity} → {data.toCity}
              </p>

              <p className="text-gray-500">
                {data.vehicles
                  ?.map((v) => {
                    const type =
                      v.vehicleType.charAt(0).toUpperCase() +
                      v.vehicleType.slice(1);

                    const condition = v.vehicleCondition
                      ? v.vehicleCondition === "nonrunner"
                        ? "Non-Runner"
                        : v.vehicleCondition === "forklift"
                          ? "Requires Forklift"
                          : "Runner"
                      : null;

                    return condition ? `${type} (${condition})` : type;
                  })
                  .join(", ")}
              </p>

              <p className="text-gray-500">
                {/* Transport */}
                {data.transportType
                  ? data.transportType.replace(/([A-Z])/g, " $1")
                  : "Door to Door"}{" "}
                • {/* Collection Type */}
                {data.collectionDateType === "specificDate"
                  ? "Specific Date"
                  : data.collectionDateType?.toUpperCase() || "Flexible"}
                {/* Collection Date */}
                {data.collectionDateType === "specificDate" &&
                  data.collectionDate && (
                    <> — {new Date(data.collectionDate).toLocaleDateString()}</>
                  )}
              </p>
            </div>

            {/* 🔹 PRICE SECTION (SAME STRUCTURE ALWAYS) */}
            <hr className="my-2" />

            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>
                {breakdown.length > 0 ? `R${subtotal}` : "To be confirmed"}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>VAT (15%)</span>
              <span>{breakdown.length > 0 ? `R${vat?.toFixed(0)}` : "—"}</span>
            </div>

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>
                {breakdown.length > 0
                  ? `R${totalWithVat?.toFixed(0)}`
                  : "To be confirmed"}
              </span>
            </div>

            {/* 🔹 MESSAGE */}
            {breakdown.length > 0 ? (
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                This is an estimated price based on standard transport rates
                (excl. VAT). Final pricing may vary depending on vehicle
                condition, route availability, and operational factors.
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Instant pricing is not available for this route or vehicle type.
                Submit your request and our team will provide a confirmed quote.
              </p>
            )}
          </>
        )}
      </div>

      <div>
        <label className="block font-medium mb-2">
          Do you have a price to beat? (optional)
        </label>

        <input
          type="number"
          value={priceToBeat ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setPriceToBeat(value ? Number(value) : undefined);
          }}
          placeholder="e.g. 1800"
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

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

      <div>
        <label className="block font-medium mb-2">Additional Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything we should know about the vehicle?"
          className="w-full border rounded-lg px-4 py-3 h-24"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={back}
          className="border px-6 py-3 rounded-lg"
        >
          Back
        </button>

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Submit Quote
        </button>
      </div>
    </form>
  );
}
