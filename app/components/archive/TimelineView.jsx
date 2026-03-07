"use client";
import { useState, useEffect } from "react";

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

export default function TimelineView({ events = [], loading = false }) {
  const [expanded, setExpanded] = useState(null);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "20px 0" }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: 80, background: "#0a1628", borderRadius: 10, animation: "pulse 1.5s infinite" }} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "#475569" }}>
        <div style={{ fontSize: 30, marginBottom: 8 }}>📅</div>
        <div style={{ fontSize: 13 }}>لا توجد أحداث مطابقة</div>
      </div>
    );
  }

  const formatDate = (d) => {
    try { return new Date(d).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }); }
    catch { return d; }
  };

  return (
    <div style={{ position: "relative", padding: "20px 0 20px 30px" }}>
      {/* Timeline line */}
      <div style={{ position: "absolute", right: 14, top: 0, bottom: 0, width: 2, background: "#1e293b" }} />

      {events.map((ev, i) => {
        const color = TYPE_COLORS[ev.event_type] || "#64748b";
        const icon = TYPE_ICONS[ev.event_type] || "📌";
        const isExpanded = expanded === ev.id;

        return (
          <div key={ev.id} style={{ position: "relative", marginBottom: 20, paddingRight: 36 }}>
            {/* Dot */}
            <div style={{
              position: "absolute", right: 6, top: 8, width: 18, height: 18, borderRadius: "50%",
              background: color + "33", border: `2px solid ${color}`, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 10, zIndex: 2,
            }}>
              {icon}
            </div>

            {/* Card */}
            <div
              onClick={() => setExpanded(isExpanded ? null : ev.id)}
              style={{
                background: "#0a1628", border: `1px solid ${color}33`, borderRadius: 10,
                padding: "14px 16px", cursor: "pointer", transition: "border-color 0.2s",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: color + "22", color }}>
                  {ev.event_type}
                </span>
                {ev.impact_score && (
                  <span style={{
                    fontSize: 9, padding: "2px 6px", borderRadius: 4,
                    background: ev.impact_score >= 8 ? "#ef444422" : ev.impact_score >= 5 ? "#f59e0b22" : "#22c55e22",
                    color: ev.impact_score >= 8 ? "#ef4444" : ev.impact_score >= 5 ? "#f59e0b" : "#22c55e",
                  }}>
                    تأثير: {ev.impact_score}/10
                  </span>
                )}
                <span style={{ fontSize: 10, color: "#475569", marginRight: "auto" }}>
                  {formatDate(ev.occurred_at)}
                </span>
              </div>

              <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>
                {ev.title_ar}
              </div>

              {ev.description_ar && (
                <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6 }}>
                  {isExpanded ? ev.description_ar : ev.description_ar.slice(0, 120) + (ev.description_ar.length > 120 ? "..." : "")}
                </div>
              )}

              {/* Expanded details */}
              {isExpanded && (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                  {ev.why_it_happened && (
                    <div style={{ background: "#080f1c", borderRadius: 8, padding: 12, borderRight: `3px solid ${color}` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", marginBottom: 4 }}>❓ لماذا حدث؟</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7 }}>{ev.why_it_happened}</div>
                    </div>
                  )}
                  {ev.what_it_means && (
                    <div style={{ background: "#080f1c", borderRadius: 8, padding: 12, borderRight: `3px solid #22c55e` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", marginBottom: 4 }}>💡 ماذا يعني لك؟</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7 }}>{ev.what_it_means}</div>
                    </div>
                  )}
                  {ev.tags && ev.tags.length > 0 && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {ev.tags.map(t => (
                        <span key={t} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "#1e293b", color: "#64748b" }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ fontSize: 9, color: "#475569", marginTop: 6 }}>
                {isExpanded ? "▲ إخفاء التفاصيل" : "▼ عرض التفاصيل"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
