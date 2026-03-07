"use client";
import { toWestern } from "../DateDisplay";

const TYPE_COLORS = {
  political: "#3b82f6", economic: "#22c55e", security: "#ef4444",
  health: "#06b6d4", energy: "#f59e0b", tech: "#8b5cf6",
  social: "#ec4899", diplomatic: "#0ea5e9",
};

const TYPE_ICONS = {
  political: "🏛️", economic: "💰", security: "🛡️",
  health: "🏥", energy: "⚡", tech: "💻",
  social: "🎭", diplomatic: "🤝",
};

export default function EventsGrid({ events = [], loading = false, onLoadMore, hasMore = false }) {
  if (loading && events.length === 0) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{ height: 140, background: "#0a1628", borderRadius: 10, animation: "pulse 1.5s infinite" }} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
        <div style={{ fontSize: 30, marginBottom: 8 }}>📋</div>
        <div style={{ fontSize: 13 }}>لا توجد أحداث مطابقة</div>
      </div>
    );
  }

  const formatDate = (d) => {
    try { return toWestern(new Date(d).toLocaleDateString("ar-EG", { year: "numeric", month: "short" })); }
    catch { return d; }
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {events.map(ev => {
          const color = TYPE_COLORS[ev.event_type] || "#64748b";
          const icon = TYPE_ICONS[ev.event_type] || "📌";
          return (
            <div key={ev.id} style={{
              background: "#0a1628", border: `1px solid ${color}33`, borderRadius: 10,
              padding: "16px", display: "flex", flexDirection: "column",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: color + "22", color }}>{ev.event_type}</span>
                {ev.impact_score && (
                  <span style={{
                    fontSize: 9, padding: "2px 6px", borderRadius: 4, marginRight: "auto",
                    background: ev.impact_score >= 8 ? "#ef444422" : "#f59e0b22",
                    color: ev.impact_score >= 8 ? "#ef4444" : "#f59e0b",
                    fontWeight: 700,
                  }}>
                    {ev.impact_score}/10
                  </span>
                )}
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: "#f8fafc", marginBottom: 4, lineHeight: 1.5 }}>
                {ev.title_ar}
              </div>

              <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 8 }}>
                📍 {ev.country_code} • {formatDate(ev.occurred_at)}
              </div>

              {ev.description_ar && (
                <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6, marginBottom: 10, flex: 1 }}>
                  {ev.description_ar.slice(0, 100)}...
                </div>
              )}

              {ev.tags && ev.tags.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {ev.tags.slice(0, 3).map(t => (
                    <span key={t} style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: "#1e293b", color: "#94a3b8" }}>
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasMore && (
        <button onClick={onLoadMore} disabled={loading} style={{
          width: "100%", marginTop: 16, padding: 12, borderRadius: 8,
          border: "1px solid #1e293b", background: "transparent", color: "#22c55e",
          fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        }}>
          {loading ? "⏳ جاري التحميل..." : "عرض المزيد"}
        </button>
      )}
    </div>
  );
}
