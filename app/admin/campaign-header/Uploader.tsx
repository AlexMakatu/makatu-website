"use client";
import { useState } from "react";

const PURPLE = "#4b2a7b";

export default function Uploader() {
  const [key, setKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [drag, setDrag] = useState(false);

  async function upload() {
    if (!file || !key) return setErr("Enter the admin key and choose an image.");
    setBusy(true); setErr(""); setUrl(""); setCopied(false);
    const fd = new FormData();
    fd.append("key", key);
    fd.append("file", file);
    try {
      const r = await fetch("/api/admin/campaign-header", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Upload failed");
      setUrl(j.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  const box: React.CSSProperties = { width: "100%", padding: 12, border: `1px solid #ccc`, borderRadius: 8, fontSize: 15, boxSizing: "border-box" };
  const btn: React.CSSProperties = { background: PURPLE, color: "#fff", border: 0, borderRadius: 8, padding: "12px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer" };

  return (
    <main style={{ minHeight: "100vh", background: "#f6f3fb", fontFamily: "'League Spartan', system-ui, sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 560, margin: "40px auto", background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 8px 30px rgba(75,42,123,.12)" }}>
        <h1 style={{ color: PURPLE, marginTop: 0 }}>Campaign header upload</h1>
        <p style={{ color: "#555" }}>Upload an image, then copy the link into Zoho <b>Header_Image_URL</b>.</p>

        <label style={{ fontWeight: 600 }}>Admin key</label>
        <input type="password" value={key} onChange={(e) => setKey(e.target.value)} style={{ ...box, margin: "6px 0 18px" }} />

        <label
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
          style={{ display: "block", border: `2px dashed ${drag ? PURPLE : "#bba8d8"}`, borderRadius: 12, padding: 28, textAlign: "center", cursor: "pointer", background: drag ? "#efe8f8" : "#fbf9fe", color: PURPLE }}
        >
          {file ? file.name : "Drop image here or click to choose (JPG, PNG, WEBP, GIF · max 8 MB)"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>

        <button onClick={upload} disabled={busy} style={{ ...btn, marginTop: 18, width: "100%", opacity: busy ? 0.6 : 1 }}>
          {busy ? "Uploading…" : "Upload"}
        </button>

        {err && <p style={{ color: "#b00020", marginTop: 14 }}>{err}</p>}

        {url && (
          <div style={{ marginTop: 22 }}>
            <img src={`${url}?w=1000`} alt="Uploaded header" style={{ width: "100%", borderRadius: 10, marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <input readOnly value={url} onFocus={(e) => e.target.select()} style={box} />
              <button onClick={copy} style={btn}>{copied ? "Copied ✓" : "Copy"}</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
