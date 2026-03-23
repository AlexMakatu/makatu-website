"use client";

import { useState } from "react";

export default function StepContact({ data, back }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  async function submit(e: any) {
    e.preventDefault();

    console.log({
      ...data,
      name,
      email,
      phone,
    });

    alert("Quote request submitted");
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label className="block font-medium mb-2">Full Name</label>

        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Email</label>

        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Phone</label>

        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
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

        <button className="bg-black text-white px-6 py-3 rounded-lg">
          Submit Quote
        </button>
      </div>
    </form>
  );
}
