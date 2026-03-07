"use client";
import { useState, useEffect } from "react";

/**
 * RSSNewsBars — شريطان أخبار RSS متحركان
 * الأول: أخبار السعودية (العربية — saudi-today)
 * الثاني: أخبار الأسواق والاقتصاد (العربية — aswaq)
 */

const BARS = [
  {
    id: "saudi",
    label: "أخبار السعودية",
    icon: "🇸🇦",
    color: "#22c55e",
    bgColor: "#22c55e15",
    rssUrl: "/api/rss-bar?feed=saudi",
  },
  {
    id: "markets",
    label: "الأسواق والاقتصاد",
    icon: "📈",
    color: "#f59e0b",
    bgColor: "#f59e0b15",
    rssUrl: "/api/rss-bar?feed=markets",
  },
];

function ScrollingBar({ bar }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchRSS() {
      try {
        const res = await fetch(bar.rssUrl);
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (mounted && data.items?.length > 0) {
          setItems(data.items);
        }
      } catch {
        // keep empty — will show label only
      }
      if (mounted) setLoading(false);
    }
    fetchRSS();
    const interval = setInterval(fetchRSS, 5 * 60 * 1000);
    return () => { mounted = false; clearInterval(interval); };
  }, [bar.rssUrl]);

  const doubled = items.length > 0 ? [...items, ...items] : [];

  return (
    <div style={{
      background: "#070e1a",
      borderBottom: "1px solid #1e293b",
      overflow: "hidden",
      position: "relative",
      height: 28,
      display: "flex",
      alignItems: "center",
      direction: "rtl",
    }}>
      <style>{`
        @keyframes scrollRTL_${bar.id} {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
      `}</style>

      {/* Label badge */}
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "0 12px",
        background: `linear-gradient(to left, #070e1a 70%, transparent)`,
        zIndex: 2,
        minWidth: 140,
      }}>
        <span style={{ fontSize: 12 }}>{bar.icon}</span>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          color: bar.color,
          whiteSpace: "nowrap",
        }}>
          {bar.label}
        </span>
        {!loading && items.length > 0 && (
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: bar.color,
            display: "inline-block",
            animation: "pulse 1.5s infinite",
          }} />
        )}
      </div>

      {/* Gradient left edge */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 30,
        background: "linear-gradient(to right, #070e1a, transparent)", zIndex: 1,
      }} />

      {/* Scrolling headlines */}
      {items.length > 0 ? (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          animation: `scrollRTL_${bar.id} ${items.length * 5}s linear infinite`,
          whiteSpace: "nowrap",
          paddingRight: 150,
        }}>
          {doubled.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "0 20px",
                textDecoration: "none",
                borderRight: i > 0 ? "1px solid #1e293b33" : "none",
              }}
            >
              <span style={{ fontSize: 11, color: "#cbd5e1", fontWeight: 500 }}>
                {item.title}
              </span>
              {item.time && (
                <span style={{ fontSize: 9, color: "#64748b" }}>
                  {item.time}
                </span>
              )}
            </a>
          ))}
        </div>
      ) : (
        <div style={{ paddingRight: 150, fontSize: 11, color: "#64748b" }}>
          {loading ? "جارٍ التحميل..." : "لا توجد أخبار حالياً"}
        </div>
      )}
    </div>
  );
}

export default function RSSNewsBars() {
  return (
    <div>
      {BARS.map(bar => (
        <ScrollingBar key={bar.id} bar={bar} />
      ))}
    </div>
  );
}
