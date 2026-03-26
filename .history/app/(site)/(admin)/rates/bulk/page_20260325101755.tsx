"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type CsvRow = {
  fromCity: string;
  toCity: string;
  vehicleType: string;
  priceType: "fixed" | "startingFrom" | "negotiable" | "quoteRequired";
  price?: string;
  active?: string;
};

type UploadResult =
  | { row: CsvRow; success: true }
  | { row: CsvRow; success?: false; error: string };

/* ================= COMPONENT ================= */

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<UploadResult[]>([]);

  /* 🔐 Load saved key */
  useEffect(() => {
    const saved = sessionStorage.getItem("adminKey");
    if (saved) setKey(saved);
  }, []);

  /* ================= HANDLERS ================= */

  async function handleUpload() {
    if (!file || !key) {
      alert("File and admin key are required");
      return;
    }

    sessionStorage.setItem("adminKey", key);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", key);

    setLoading(true);

    try {
      const res = await fetch("/api/admin/route-rate/bulk", {
        method: "POST",
        body: formData,
      });

      const data: { results?: UploadResult[]; error?: string } =
        await res.json();

      if (!res.ok) {
        alert(data.error || "Upload failed");
        setLoading(false);
        return;
      }

      setResults(data.results || []);
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Bulk Upload Route Rates</h1>

      {/* 🔐 Admin Key */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Admin Key</label>
        <input
          type="password"
          placeholder="Enter admin key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* 📄 File Upload */}
      <div className="space-y-1">
        <label className="text-sm font-medium">CSV File</label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full"
        />
      </div>

      {/* 🚀 Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>

      {/* 📊 Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-semibold">Results</h2>

          <div className="max-h-96 overflow-auto border rounded">
            {results.map((r, i) => {
              const isSuccess = r.success === true;

              return (
                <div
                  key={i}
                  className={`p-2 text-sm border-b flex justify-between ${
                    isSuccess ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <div>
                    <span className="font-medium">
                      {r.row.fromCity} → {r.row.toCity}
                    </span>{" "}
                    ({r.row.vehicleType})
                  </div>

                  <div>
                    {isSuccess ? (
                      <span className="text-green-600">✅ Saved</span>
                    ) : (
                      <span className="text-red-600">❌ {r.error}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
