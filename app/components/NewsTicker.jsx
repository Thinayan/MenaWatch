"use client";
import { useState, useEffect, useCallback } from "react";

// ── Source Configuration ──────────────────────────────────
const SOURCES = {
  alarabiya:  { nameAr: "العربية",              color: "#c4161c" },
  alhadath:   { nameAr: "الحدث",                color: "#1a73e8" },
  aljazeera:  { nameAr: "الجزيرة",              color: "#d4a843" },
  spa:        { nameAr: "واس",                  color: "#006633" },
  ain:        { nameAr: "عين",                  color: "#2d8a4e" },
  okaz:       { nameAr: "عكاظ",                 color: "#8b5cf6" },
  aleqt:      { nameAr: "الاقتصادية",           color: "#1e3a5f" },
  argaam:     { nameAr: "أرقام",                color: "#00bcd4" },
};

const CATEGORIES = [
  { id: "all",      label: "الكل",    sources: null },
  { id: "main",     label: "رئيسي",   sources: ["alarabiya", "alhadath", "aljazeera"] },
  { id: "economy",  label: "اقتصاد",  sources: ["aleqt", "argaam"] },
  { id: "saudi",    label: "سعودي",   sources: ["spa", "ain", "okaz"] },
];

const FETCH_SOURCES = ["alarabiya", "alhadath", "spa", "aljazeera", "aleqt", "argaam"];

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// ── Time Formatting ───────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return "";
  const diffMs = now - then;
  if (diffMs < 0) return "الآن";

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} دقائق`;
  if (hours < 24) return `منذ ${hours} ساعات`;
  return `منذ ${days} أيام`;
}

// ── Skeleton Loader ───────────────────────────────────────
function SkeletonItem() {
  return (
    <div style={{
      display: "flex",
      gap: 10,
      padding: "10px 12px",
      borderBottom: "1px solid #1e293b",
    }}>
      <div style={{
        width: 56, height: 42,
        borderRadius: 4,
        background: "linear-gradient(110deg, #1e293b 30%, #2a3a52 50%, #1e293b 70%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{
          height: 10, borderRadius: 3, width: "90%",
          background: "linear-gradient(110deg, #1e293b 30%, #2a3a52 50%, #1e293b 70%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }} />
        <div style={{
          height: 10, borderRadius: 3, width: "60%",
          background: "linear-gradient(110deg, #1e293b 30%, #2a3a52 50%, #1e293b 70%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }} />
        <div style={{
          height: 8, borderRadius: 3, width: "30%",
          background: "linear-gradient(110deg, #1e293b 30%, #2a3a52 50%, #1e293b 70%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }} />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
export default function NewsTicker() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled(
        FETCH_SOURCES.map(src =>
          fetch(`/api/rss?source=${src}`)
            .then(r => {
              if (!r.ok) throw new Error(`HTTP ${r.status}`);
              return r.json();
            })
            .then(data => ({
              source: src,
              articles: (data.articles || []).map(a => ({ ...a, source: src })),
            }))
        )
      );

      const allArticles = [];
      for (const result of results) {
        if (result.status === "fulfilled" && result.value.articles) {
          allArticles.push(...result.value.articles);
        }
      }

      // Sort by date descending
      allArticles.sort((a, b) => {
        const da = new Date(a.pubDate || 0).getTime();
        const db = new Date(b.pubDate || 0).getTime();
        return db - da;
      });

      if (allArticles.length === 0) {
        setError("لا توجد أخبار متاحة حالياً");
      } else {
        setArticles(allArticles);
      }
    } catch (err) {
      setError("تعذر تحميل الأخبار");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount + auto-refresh every 5 minutes
  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNews]);

  // Filter articles by active category
  const filteredArticles = activeCategory === "all"
    ? articles
    : articles.filter(a => {
        const cat = CATEGORIES.find(c => c.id === activeCategory);
        return cat && cat.sources && cat.sources.includes(a.source);
      });

  return (
    <div style={{
      direction: "rtl",
      fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif",
      background: "#0a1628",
      border: "1px solid #1e293b",
      borderRadius: 8,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
    }}>
      {/* Shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "10px 12px 0",
        borderBottom: "1px solid #1e293b",
        flexShrink: 0,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}>
          <span style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <span style={{
              width: 7, height: 7,
              borderRadius: "50%",
              background: "#ef4444",
              display: "inline-block",
              animation: "pulse-dot 2s infinite",
            }} />
            آخر الأخبار
          </span>
          <span style={{ fontSize: 10, color: "#94a3b8" }}>
            {articles.length > 0 ? `${articles.length} خبر` : ""}
          </span>
        </div>

        {/* Category Tabs */}
        <div style={{
          display: "flex",
          gap: 2,
          paddingBottom: 8,
        }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  flex: 1,
                  padding: "5px 0",
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: "inherit",
                  color: isActive ? "#e2e8f0" : "#64748b",
                  background: isActive ? "#1e293b" : "transparent",
                  border: "1px solid",
                  borderColor: isActive ? "#334155" : "transparent",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pulse-dot animation */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* Content Area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}>
        {/* Hide webkit scrollbar */}
        <style>{`
          .news-ticker-scroll::-webkit-scrollbar { display: none; }
        `}</style>

        {loading ? (
          <div>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} />)}
          </div>
        ) : error ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 16px",
            gap: 12,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 28, opacity: 0.4 }}>!</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{error}</div>
            <button
              onClick={fetchNews}
              style={{
                padding: "6px 16px",
                fontSize: 11,
                fontFamily: "inherit",
                color: "#e2e8f0",
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              إعادة المحاولة
            </button>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div style={{
            padding: "32px 16px",
            textAlign: "center",
            fontSize: 12,
            color: "#94a3b8",
          }}>
            لا توجد أخبار في هذا القسم
          </div>
        ) : (
          <div className="news-ticker-scroll" style={{
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            height: "100%",
          }}>
            {filteredArticles.map((article, idx) => {
              const src = SOURCES[article.source] || { nameAr: article.source, color: "#64748b" };
              return (
                <a
                  key={`${article.source}-${idx}`}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "10px 12px",
                    borderBottom: "1px solid #1e293b",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "background 0.15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#111d33"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  {/* Thumbnail */}
                  {article.thumbnail ? (
                    <div style={{
                      width: 56,
                      height: 42,
                      borderRadius: 4,
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "#1e293b",
                    }}>
                      <img
                        src={article.thumbnail}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        onError={e => { e.currentTarget.style.display = "none"; }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: 56,
                      height: 42,
                      borderRadius: 4,
                      background: `${src.color}15`,
                      border: `1px solid ${src.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: 10,
                      color: src.color,
                      fontWeight: 700,
                    }}>
                      {src.nameAr.slice(0, 2)}
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title */}
                    <div style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#e2e8f0",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginBottom: 4,
                    }}>
                      {article.title}
                    </div>

                    {/* Source badge + time */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 10,
                    }}>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        color: src.color,
                        fontWeight: 600,
                      }}>
                        <span style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: src.color,
                          display: "inline-block",
                          flexShrink: 0,
                        }} />
                        {src.nameAr}
                      </span>
                      <span style={{ color: "#94a3b8" }}>|</span>
                      <span style={{ color: "#94a3b8" }}>
                        {timeAgo(article.pubDate)}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
