"use client";

import { useState } from "react";
import { QuoteData } from "@/app/get-a-quote/page";

type Props = {
  next: (values: Partial<QuoteData>) => void;
  back: () => void;
  data: QuoteData;
};

export default function StepContact({ next, back, data }: Props)
const [name, setName] = useState(data.fullName || "");
const [email, setEmail] = useState(data.email || "");
const [phone, setPhone] = useState(data.phone || "");
const [budget, setBudget] = useState("");
const [notes, setNotes] = useState(data.notes || "");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      name,
      email,
      phone,
      budget,
      notes,
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to submit quote");
      }

      alert("Quote request sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong submitting your quote.");
    }
  }
  return (
    <form onSubmit={submit} className="space-y-6">
      {/* NAME */}
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

      {/* EMAIL */}
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

      {/* PHONE */}
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

      {/* BUDGET / PRICE TO BEAT */}
      <div>
        <label className="block font-medium mb-2">
          Budget or Price to Beat (optional)
        </label>

        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Example: 8000"
          className="w-full border rounded-lg px-4 py-3"
        />

        <p className="text-sm text-gray-500 mt-1">
          If you have received another quote we can try beat it.
        </p>
      </div>

      {/* NOTES */}
      <div>
        <label className="block font-medium mb-2">Additional Notes</label>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything we should know about the vehicle?"
          className="w-full border rounded-lg px-4 py-3 h-24"
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
          Submit Quote
        </button>
      </div>
    </form>
  );
}
