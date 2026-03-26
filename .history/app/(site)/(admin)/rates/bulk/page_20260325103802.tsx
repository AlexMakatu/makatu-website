"use client";

import { useState } from "react";
import type { CsvRow, UploadResult } from "@/types/routeRate";

/* ================= HELPERS ================= */

function parseCSV(text: string): CsvRow[] {
  const lines = text.split("\n").filter(Boolean);
  const [, ...rows] = lines;

  return rows.map((row) => {
    const c = row.split(",");
    return {
      fromCity: c[0]?.trim(),
      toCity: c[1]?.trim(),
      vehicleType: c[2]?.trim(),
      priceType: c[3]?.trim() as CsvRow["priceType"],
      price: c[4]?.trim(),
      active: c[5]?.trim(),
    };
  });
}

function validateRow(row: CsvRow): string | null {
  if (!row.fromCity || !row.toCity) return "Missing city";
  if (!row.vehicleType) return "Missing vehicle type";

  if (
    !["fixed", "startingFrom", "negotiable", "quoteRequired"].includes(
      row.priceType,
    )
  ) {
    return "Invalid price type";
  }

  if (row.priceType === "fixed" && !row.price) {
    return "Fixed price required";
  }

  return null;
}

/* ================= COMPONENT ================= */

export default function BulkUploadPage() {
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);

  async function handleFile(file: File) {
    const text = await file.text();
    const parsed = parseCSV(text);
    setRows(parsed);
  }

  async function handleUpload() {
    if (!file || !key) return alert("Missing file or key");
    document.cookie = `adminKey=${key}; path=/`;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", key);

    const res = await fetch("/api/admin/route-rate/bulk", {
      method: "POST",
      body: formData,
    });

    const data: { results: UploadResult[] } = await res.json();
    setResults(data.results);
    setLoading(false);
  }

  function downloadErrors() {
    const errors = results.filter((r) => !r.success);

    const csv =
      "fromCity,toCity,vehicleType,error\n" +
      errors
        .map(
          (e) =>
            `${e.row.fromCity},${e.row.toCity},${e.row.vehicleType},${e.error}`,
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "errors.csv";
    a.click();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Bulk Upload (Pro)</h1>

      <input
        type="password"
        placeholder="Admin key"
        onChange={(e) => setKey(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setFile(f);
          handleFile(f);
        }}
      />

      {/* PREVIEW */}
      {rows.length > 0 && (
        <div className="border rounded max-h-64 overflow-auto">
          {rows.map((r, i) => {
            const error = validateRow(r);

            return (
              <div
                key={i}
                className={`p-2 text-sm ${error ? "bg-red-50" : "bg-green-50"}`}
              >
                {r.fromCity} → {r.toCity} ({r.vehicleType})
                {error && <span className="text-red-600"> - {error}</span>}
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-black text-white px-4 py-2"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* RESULTS */}
      {results.length > 0 && (
        <>
          <button onClick={downloadErrors} className="text-blue-600 underline">
            Download Errors
          </button>

          <div className="max-h-64 overflow-auto border">
            {results.map((r, i) => (
              <div key={i} className="p-2 text-sm">
                {r.success ? "✅" : "❌"} {r.row.fromCity} → {r.row.toCity}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
