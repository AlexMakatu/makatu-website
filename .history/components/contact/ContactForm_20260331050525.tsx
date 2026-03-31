"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSuccess(true);
      e.currentTarget.reset();
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ROW 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Your Name"
          required
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
        />
      </div>

      {/* ROW 2 */}
      <input
        name="phone"
        placeholder="Phone"
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
      />

      {/* MESSAGE */}
      <textarea
        name="message"
        placeholder="Message"
        required
        rows={4}
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
      />

      {/* BUTTON */}
      <button
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      {success && (
        <p className="text-green-600 text-sm">Message sent successfully!</p>
      )}
    </form>
  );
}
