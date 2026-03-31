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
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" placeholder="Your Name" required className="input" />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="input"
      />
      <input name="phone" placeholder="Phone" className="input" />
      <textarea
        name="message"
        placeholder="Message"
        required
        className="input"
      />

      <button
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      {success && <p className="text-green-600">Message sent successfully!</p>}
    </form>
  );
}
