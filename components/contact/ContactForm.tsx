"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setFailed(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => null);

      if (res.ok && json?.success) {
        setSuccess(true);
        form.reset();
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
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

      {failed && (
        <p className="text-red-600 text-sm">
          Sorry, your message could not be sent. Please{" "}
          <a
            href="https://wa.me/27646806414"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            WhatsApp us
          </a>{" "}
          instead.
        </p>
      )}
    </form>
  );
}
