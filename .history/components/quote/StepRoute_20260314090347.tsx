"use client";

import { useState } from "react";

type Props = {
  next: (values: {
    pickupCity: string;
    dropoffCity: string;
    deliveryDate: string;
  }) => void;
  back: () => void;
};

export default function StepRoute({ next, back }: Props) {
  const [pickupCity, setPickupCity] = useState("");
  const [dropoffCity, setDropoffCity] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    next({
      pickupCity,
      dropoffCity,
      deliveryDate,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* PICKUP CITY */}
      <div>
        <label className="block font-medium mb-2">Pickup City</label>

        <input
          required
          value={pickupCity}
          onChange={(e) => setPickupCity(e.target.value)}
          placeholder="Enter pickup city"
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      {/* DROPOFF CITY */}
      <div>
        <label className="block font-medium mb-2">Dropoff City</label>

        <input
          required
          value={dropoffCity}
          onChange={(e) => setDropoffCity(e.target.value)}
          placeholder="Enter destination city"
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      {/* DELIVERY DATE */}
      <div>
        <label className="block font-medium mb-2">Desired Delivery Date</label>

        <input
          type="date"
          required
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={back}
          className="border px-6 py-3 rounded-lg"
        >
          Back
        </button>

        <button className="bg-black text-white px-6 py-3 rounded-lg">
          Continue
        </button>
      </div>
    </form>
  );
}
