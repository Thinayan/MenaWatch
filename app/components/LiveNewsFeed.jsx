"use client";
import { useState, useEffect } from "react";
import { toWestern } from "./DateDisplay";

/**
 * LiveNewsFeed — Drop-in component for tabs to show live articles
 * Fetches from /api/articles with category filter + fallback to static data.
 *
 * Props:
 *   category: "political"|"economic"|"security"|"health"|"energy"|"tech"|"general"
 *   country: ISO code (optional)
 *   limit: number (default 5)
 *   title: string (section title)
 *   icon: string (emoji)
 *   fallbackNews: array (static news items as fallback)
 */
export default function LiveNewsFeed({
  category = "general",
  country,
  limit = 5,
  title = "📰 آخر الأخبار",
  icon,
  fallbackNews = [],
}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchArticles() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ category, limit: String(limit) });
        if (country) params.set("country", country);

        const res = await fetch(`/api/articles?${params}`);
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();

        if (!cancelled && data.articles?.length > 0) {
          setArticles(data.articles);
          setError(false);
        } else if (!cancelled) {
          setError(true);
        }
      } catch {
        if (!cancelled) setError(true);
      }
      if (!cancelled) setLoading(false);
    }
    fetchArticles();
    return () => { cancelled = true; };
  }, [category, country, limit]);

  // Use fallback if API fails or returns empty
  const displayArticles = articles.length > 0 ? articles : [];
  const showFallback = (error || articles.length === 0) && fallbackNews.length > 0;

  function timeAgo(dateStr) {
    if (!dateStr) return "";
    try {
      const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
      if (diff < 60) return "الآن";
      if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
      if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
      if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
      return toWestern(new Date(dateStr).toLocaleDateString("ar-EG", { month: "short", day: "numeric" }));
    } catch { return ""; }
  }

  const SENTIMENT_DOT = {
    positive: "#22c55e",
    negative: "#ef4444",
    neutral: "#94a3b8",
  };

  return (
    <div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        {icon && <span>{icon}</span>}
        <span>{title}</span>
        {!loading && articles.length > 0 && (
          <span style={{
            fontSize: 9, padding: "1px 6px", borderRadius: 3,
            background: "#22c55e22", color: "#22c55e", fontWeight: 600, marginRight: 4,
          }}>
            مباشر
          </span>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6,
              padding: "10px 14px", height: 50,
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
          ))}
        </div>
      )}

      {/* Live articles */}
      {!loading && displayArticles.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {displayArticles.map((a, i) => (
            <a
              key={a.id || i}
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#0a1628",
                border: "1px solid #1e293b",
                borderRadius: 6,
                padding: "10px 14px",
                textDecoration: "none",
                transition: "border-color 0.15s",
                cursor: "pointer",
                gap: 10,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#334155")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e293b")}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 11, color: "#cbd5e1", lineHeight: 1.4,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {a.title}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                  <span style={{ fontSize: 9, color: "#94a3b8" }}>{a.source_name}</span>
                  <span style={{ fontSize: 9, color: "#334155" }}>·</span>
                  <span style={{ fontSize: 9, color: "#94a3b8" }}>{timeAgo(a.pub_date)}</span>
                  <span style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: SENTIMENT_DOT[a.sentiment_label] || "#94a3b8",
                    display: "inline-block",
                  }} />
                </div>
              </div>

              {a.thumbnail && (
                <div style={{
                  width: 44, height: 44, borderRadius: 4, overflow: "hidden",
                  flexShrink: 0, background: "#1e293b",
                }}>
                  <img
                    src={a.thumbnail}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              )}
            </a>
          ))}
        </div>
      )}

      {/* Fallback static news */}
      {showFallback && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {fallbackNews.map((n, i) => (
            <div key={i} style={{
              background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6,
              padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 11, color: "#cbd5e1" }}>{n.title}</div>
                <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>{n.date}</div>
              </div>
              {n.tag && (
                <span style={{
                  fontSize: 9, padding: "2px 8px", borderRadius: 3,
                  background: "#10b98122", color: "#10b981", flexShrink: 0,
                }}>
                  {n.tag}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && !showFallback && displayArticles.length === 0 && (
        <div style={{
          padding: 16, textAlign: "center", fontSize: 11, color: "#94a3b8",
          background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6,
        }}>
          لا توجد أخبار حالياً
        </div>
      )}
    </div>
  );
}
