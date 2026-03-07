"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";


const CATEGORIES = [
  { value: "", label: "الكل" },
  { value: "political", label: "🏛️ سياسي" },
  { value: "economic", label: "💰 اقتصادي" },
  { value: "security", label: "🛡️ أمني" },
  { value: "health", label: "🏥 صحي" },
  { value: "energy", label: "⚡ طاقة" },
  { value: "tech", label: "💻 تقني" },
];

const COUNTRIES = [
  { value: "", label: "جميع الدول" },
  { value: "SA", label: "🇸🇦 السعودية" }, { value: "AE", label: "🇦🇪 الإمارات" },
  { value: "QA", label: "🇶🇦 قطر" }, { value: "KW", label: "🇰🇼 الكويت" },
  { value: "BH", label: "🇧🇭 البحرين" }, { value: "OM", label: "🇴🇲 عمان" },
  { value: "IQ", label: "🇮🇶 العراق" }, { value: "EG", label: "🇪🇬 مصر" },
  { value: "JO", label: "🇯🇴 الأردن" }, { value: "LB", label: "🇱🇧 لبنان" },
  { value: "SY", label: "🇸🇾 سوريا" }, { value: "YE", label: "🇾🇪 اليمن" },
  { value: "LY", label: "🇱🇾 ليبيا" }, { value: "SD", label: "🇸🇩 السودان" },
  { value: "IR", label: "🇮🇷 إيران" },
];

const TYPES = [
  { value: "all", label: "الكل" },
  { value: "articles", label: "مقالات" },
  { value: "reports", label: "تقارير" },
];

const CATEGORY_COLORS = {
  political: "#3b82f6", economic: "#22c55e", security: "#ef4444",
  health: "#06b6d4", energy: "#f59e0b", tech: "#8b5cf6", general: "#64748b",
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQ);
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [breakdown, setBreakdown] = useState({ articles: 0, reports: 0 });
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const LIMIT = 20;

  const doSearch = async (newOffset = 0) => {
    if (query.length < 2) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ q: query, limit: String(LIMIT), offset: String(newOffset) });
      if (category) params.set("category", category);
      if (country) params.set("country", country);
      if (type !== "all") params.set("type", type);
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", toDate);

      const r = await fetch(`/api/search?${params}`);
      const d = await r.json();

      if (newOffset === 0) {
        setResults(d.results || []);
      } else {
        setResults(prev => [...prev, ...(d.results || [])]);
      }
      setTotal(d.total || 0);
      setBreakdown(d.breakdown || { articles: 0, reports: 0 });
      setHasMore(d.hasMore || false);
      setOffset(newOffset);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (initialQ.length >= 2) doSearch(0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setOffset(0);
    doSearch(0);
    // Update URL
    const params = new URLSearchParams({ q: query });
    router.push(`/search?${params}`, { scroll: false });
  };

  const sentimentDot = (s) => {
    if (s === "positive") return "#22c55e";
    if (s === "negative") return "#ef4444";
    return "#94a3b8";
  };

  const formatDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
    } catch { return d; }
  };

  const selectStyle = {
    padding: "6px 10px", background: "#0a1628", border: "1px solid #1e293b",
    borderRadius: 6, color: "#e2e8f0", fontSize: 11, fontFamily: "inherit", cursor: "pointer",
  };

  return (
    <div className="search-root" style={{ fontFamily: "'IBM Plex Sans Arabic','Tajawal',sans-serif", background: "#060d18", minHeight: "100vh", color: "#e2e8f0", direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        .search-root, .search-root * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .search-fade { animation: fadeIn 0.3s ease; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        input:focus, select:focus { outline: 1px solid #22c55e55; }
      `}</style>



      <div style={{ maxWidth: 900, margin: "0 auto", padding: "30px 20px" }}>
        {/* Search Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc", marginBottom: 12 }}>
            🔍 البحث المتقدم
          </h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ابحث في المقالات والتقارير..."
              style={{
                flex: 1, padding: "10px 14px", background: "#0a1628", border: "1px solid #1e293b",
                borderRadius: 8, color: "#e2e8f0", fontSize: 13, fontFamily: "inherit",
              }}
            />
            <button type="submit" disabled={query.length < 2 || loading} style={{
              padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer",
              background: "#22c55e", color: "#000", fontSize: 13, fontWeight: 700, fontFamily: "inherit",
              opacity: query.length < 2 || loading ? 0.5 : 1,
            }}>
              {loading ? "⏳" : "بحث"}
            </button>
          </form>

          {/* Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select value={country} onChange={e => setCountry(e.target.value)} style={selectStyle}>
              {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select value={type} onChange={e => setType(e.target.value)} style={selectStyle}>
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ ...selectStyle, width: 130 }} />
            <span style={{ color: "#94a3b8", fontSize: 11 }}>→</span>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ ...selectStyle, width: 130 }} />
            {(category || country || type !== "all" || fromDate || toDate) && (
              <button onClick={() => { setCategory(""); setCountry(""); setType("all"); setFromDate(""); setToDate(""); }} style={{
                padding: "6px 10px", borderRadius: 6, border: "1px solid #ef444433",
                background: "transparent", color: "#ef4444", fontSize: 10, cursor: "pointer", fontFamily: "inherit",
              }}>
                مسح الفلاتر ✕
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {total > 0 && (
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>
              {total} نتيجة {query && `لـ "${query}"`}
            </span>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>
              ({breakdown.articles} مقال • {breakdown.reports} تقرير)
            </span>
          </div>
        )}

        {/* Results List */}
        {results.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {results.map((r, i) => (
              <a
                key={i}
                href={r.link || "#"}
                target={r.link ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="search-fade"
                style={{
                  display: "flex", gap: 14, padding: "14px 16px",
                  background: "#0a1628", border: "1px solid #1e293b", borderRadius: 10,
                  textDecoration: "none", transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#22c55e44"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e293b"}
              >
                {/* Thumbnail */}
                {r.thumbnail && (
                  <div style={{
                    width: 80, height: 60, borderRadius: 6, flexShrink: 0,
                    background: `url(${r.thumbnail}) center/cover`, border: "1px solid #1e293b",
                  }} />
                )}

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 9, padding: "1px 6px", borderRadius: 3,
                      background: r.type === "article" ? "#3b82f622" : "#22c55e22",
                      color: r.type === "article" ? "#3b82f6" : "#22c55e",
                    }}>
                      {r.type === "article" ? "مقال" : "تقرير"}
                    </span>
                    {r.category && (
                      <span style={{
                        fontSize: 9, padding: "1px 6px", borderRadius: 3,
                        background: (CATEGORY_COLORS[r.category] || "#94a3b8") + "22",
                        color: CATEGORY_COLORS[r.category] || "#94a3b8",
                      }}>
                        {r.category}
                      </span>
                    )}
                    {r.sentiment && (
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: sentimentDot(r.sentiment) }} />
                    )}
                    <span style={{ fontSize: 9, color: "#94a3b8", marginRight: "auto" }}>
                      {r.source} • {formatDate(r.date)}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 4, lineHeight: 1.5 }}>
                    {r.title}
                  </div>
                  {r.description && (
                    <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
                      {r.description.slice(0, 150)}{r.description.length > 150 ? "..." : ""}
                    </div>
                  )}
                </div>
              </a>
            ))}

            {/* Load More */}
            {hasMore && (
              <button
                onClick={() => doSearch(offset + LIMIT)}
                disabled={loading}
                style={{
                  padding: "12px", borderRadius: 8, border: "1px solid #1e293b",
                  background: "transparent", color: "#22c55e", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", marginTop: 8,
                }}
              >
                {loading ? "⏳ جاري التحميل..." : "عرض المزيد"}
              </button>
            )}
          </div>
        ) : !loading && query.length >= 2 && total === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>لا توجد نتائج</div>
            <div style={{ fontSize: 12 }}>حاول تغيير كلمات البحث أو الفلاتر</div>
          </div>
        ) : !loading && query.length < 2 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>ابدأ البحث</div>
            <div style={{ fontSize: 12 }}>اكتب كلمتين على الأقل في مربع البحث</div>
          </div>
        ) : loading && results.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: "#0a1628", borderRadius: 10, padding: 16, height: 80, animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
