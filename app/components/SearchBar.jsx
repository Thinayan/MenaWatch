"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ compact = true }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const ref = useRef(null);
  const timerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
        const d = await r.json();
        setResults(d.results || []);
        setOpen(true);
      } catch { setResults([]); }
      setLoading(false);
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.length >= 2) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const sentimentDot = (s) => {
    if (s === "positive") return "#22c55e";
    if (s === "negative") return "#ef4444";
    return "#94a3b8";
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6,
          padding: "5px 10px", transition: "border-color 0.2s",
        }}>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setOpen(true); }}
            placeholder="بحث..."
            style={{
              background: "transparent", border: "none", outline: "none",
              color: "#e2e8f0", fontSize: 11, fontFamily: "inherit",
              width: compact ? 120 : 200, direction: "rtl",
            }}
          />
          {loading && <span style={{ fontSize: 10, color: "#94a3b8", animation: "pulse 1s infinite" }}>⏳</span>}
        </div>
      </form>

      {/* Dropdown results */}
      {open && results.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", right: 0, marginTop: 4,
          width: 340, maxHeight: 320, overflowY: "auto",
          background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)", zIndex: 1000,
        }}>
          {results.map((r, i) => (
            <a
              key={i}
              href={r.link || `/search?q=${encodeURIComponent(query)}`}
              target={r.link ? "_blank" : "_self"}
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              style={{
                display: "block", padding: "10px 14px", textDecoration: "none",
                borderBottom: i < results.length - 1 ? "1px solid #0f1829" : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#0f1829"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: r.type === "article" ? "#3b82f622" : "#22c55e22", color: r.type === "article" ? "#3b82f6" : "#22c55e" }}>
                  {r.type === "article" ? "مقال" : "تقرير"}
                </span>
                {r.sentiment && (
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: sentimentDot(r.sentiment) }} />
                )}
                <span style={{ fontSize: 9, color: "#94a3b8", marginRight: "auto" }}>{r.source}</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.4 }}>
                {r.title?.slice(0, 80)}{r.title?.length > 80 ? "..." : ""}
              </div>
            </a>
          ))}
          <button
            onClick={() => { setOpen(false); router.push(`/search?q=${encodeURIComponent(query)}`); }}
            style={{
              width: "100%", padding: "10px", border: "none", borderTop: "1px solid #1e293b",
              background: "transparent", color: "#22c55e", fontSize: 11, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            عرض جميع النتائج ←
          </button>
        </div>
      )}
    </div>
  );
}
