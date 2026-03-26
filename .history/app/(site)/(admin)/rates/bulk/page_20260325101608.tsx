"use client";

import { useState, useEffect } from "react";

type Result = {
  row: any;
  success?: boolean;
  error?: string;
};

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  // 🔐 Persist key (optional UX improvement)
  useEffect(() => {
    const saved = sessionStorage.getItem("adminKey");
    if (saved) setKey(saved);
  }, []);

  async function handleUpload() {
    if (!file || !key) {
      alert("File and key required");
      return;
    }

    sessionStorage.setItem("adminKey", key);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", key);

    setLoading(true);

    const res = await fetch("/api/admin/route-rate/bulk", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setResults(data.results || []);
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Bulk Upload Route Rates</h1>

      {/* 🔐 Key */}
      <input
        type="password"
        placeholder="Admin key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* 📄 File */}
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full"
      />

      {/* 🚀 Upload */}
      <button
        onClick={handleUpload}
        className="bg-black text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>

      {/* 📊 Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-semibold">Results</h2>

          <div className="max-h-96 overflow-auto border rounded">
            {results.map((r, i) => (
              <div
                key={i}
                className={`p-2 text-sm border-b ${
                  r.success ? "bg-green-50" : "bg-red-50"
                }`}
              >
                {r.success ? "✅" : "❌"} {r.row.fromCity} → {r.row.toCity} (
                {r.row.vehicleType}){" "}
                {r.error && <span className="text-red-600">- {r.error}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
