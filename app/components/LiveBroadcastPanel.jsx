"use client";
import { useState, useCallback } from "react";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap";

const DEFAULT_CHANNELS = [
  {
    id: "alarabiya",
    name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
    nameEn: "Al Arabiya",
    channelId: "UCahpxixMCwoANAftn6IxkTg",
    section: "main",
  },
  {
    id: "alhadath",
    name: "\u0627\u0644\u062d\u062f\u062b",
    nameEn: "Al Hadath",
    channelId: "UCrj5BGAhtWxDfqbza9T9hqA",
    section: "main",
  },
  {
    id: "ekhbariya",
    name: "\u0627\u0644\u0625\u062e\u0628\u0627\u0631\u064a\u0629",
    nameEn: "Saudi Ekhbariya",
    channelId: "UCV01ajGl6nt09h40iDoHDNg",
    section: "main",
  },
  {
    id: "aljazeera",
    name: "\u0627\u0644\u062c\u0632\u064a\u0631\u0629",
    nameEn: "Al Jazeera",
    channelId: "UCfiwzLy-8yKzIbsmZTzxDgw",
    section: "main",
  },
  {
    id: "france24",
    name: "\u0641\u0631\u0627\u0646\u0633 24",
    nameEn: "France 24 Arabic",
    channelId: "UCdTyuXgmJkG_O8_75eqej-w",
    section: "main",
  },
  {
    id: "dw",
    name: "DW \u0639\u0631\u0628\u064a\u0629",
    nameEn: "DW Arabic",
    channelId: "UC30ditU5JI16o5NbFsHde_Q",
    section: "main",
  },
];

/* ── colour tokens ─────────────────────────────────────── */
const C = {
  bgDeep: "#060d18",
  bgPanel: "#0a1628",
  border: "#1e293b",
  surface: "#0f1d32",
  surfaceHover: "#162544",
  accent: "#ef4444",
  accentGlow: "rgba(239,68,68,0.25)",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  white: "#ffffff",
};

/* ── pulse keyframes injected once via <style> ─────────── */
const PULSE_CSS = `
@keyframes livePulse {
  0%   { transform: scale(1);   opacity: 1;   }
  50%  { transform: scale(1.5); opacity: 0.4; }
  100% { transform: scale(1);   opacity: 1;   }
}
@keyframes livePulseRing {
  0%   { transform: scale(1);   opacity: 0.6; }
  100% { transform: scale(2.4); opacity: 0;   }
}
`;

/* ── sub-components ────────────────────────────────────── */

function LiveDot({ size = 8 }) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
        marginInlineStart: 6,
        flexShrink: 0,
      }}
    >
      {/* expanding ring */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: C.accent,
          animation: "livePulseRing 1.5s ease-out infinite",
        }}
      />
      {/* solid core */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: C.accent,
          animation: "livePulse 1.5s ease-in-out infinite",
          boxShadow: `0 0 6px ${C.accentGlow}`,
        }}
      />
    </span>
  );
}

function ChannelButton({ channel, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);

  const bg = isActive
    ? C.accent
    : hovered
      ? C.surfaceHover
      : C.surface;
  const color = isActive ? C.white : C.textSecondary;
  const borderColor = isActive ? C.accent : C.border;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={channel.nameEn}
      style={{
        flexShrink: 0,
        padding: "4px 10px",
        borderRadius: 6,
        border: `1px solid ${borderColor}`,
        background: bg,
        color,
        fontSize: 12,
        fontWeight: isActive ? 600 : 400,
        fontFamily: "'IBM Plex Sans Arabic', sans-serif",
        cursor: "pointer",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
        lineHeight: 1.4,
      }}
    >
      {channel.name}
    </button>
  );
}

/* ── main component ────────────────────────────────────── */

export default function LiveBroadcastPanel({ channels = DEFAULT_CHANNELS }) {
  const [activeId, setActiveId] = useState(channels[0]?.id ?? "alarabiya");

  const activeChannel =
    channels.find((c) => c.id === activeId) ?? channels[0];

  const handleSelect = useCallback((id) => {
    setActiveId(id);
  }, []);

  const iframeSrc = activeChannel
    ? `https://www.youtube.com/embed/live_stream?channel=${activeChannel.channelId}&autoplay=1&mute=1`
    : "";

  return (
    <div
      dir="rtl"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: C.bgPanel,
        borderRight: `1px solid ${C.border}`,
        fontFamily: "'IBM Plex Sans Arabic', sans-serif",
        color: C.textPrimary,
        overflow: "hidden",
      }}
    >
      {/* inject pulse animation */}
      <style>{PULSE_CSS}</style>

      {/* google font link */}
      <link rel="stylesheet" href={FONT_URL} />

      {/* ── header ──────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px 6px",
          borderBottom: `1px solid ${C.border}`,
          background: C.bgDeep,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <span role="img" aria-label="satellite">
            {"\uD83D\uDCE1"}
          </span>
          <span>{"\u0628\u062b \u0645\u0628\u0627\u0634\u0631"}</span>
          <LiveDot size={8} />
        </div>

        <span
          style={{
            fontSize: 10,
            color: C.textMuted,
            letterSpacing: "0.02em",
          }}
        >
          LIVE
        </span>
      </div>

      {/* ── channel selector ────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: 4,
          overflowX: "auto",
          padding: "8px 10px",
          background: C.bgDeep,
          borderBottom: `1px solid ${C.border}`,
          /* hide scrollbar but keep scrollable */
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {channels.map((ch) => (
          <ChannelButton
            key={ch.id}
            channel={ch}
            isActive={ch.id === activeId}
            onClick={() => handleSelect(ch.id)}
          />
        ))}
      </div>

      {/* ── video player ────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          flexShrink: 0,
          background: C.bgDeep,
          overflow: "hidden",
        }}
      >
        {activeChannel ? (
          <iframe
            key={activeChannel.id}
            src={iframeSrc}
            title={`${activeChannel.nameEn} Live`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: C.textMuted,
              fontSize: 13,
            }}
          >
            {"\u0644\u0627 \u062a\u0648\u062c\u062f \u0642\u0646\u0627\u0629 \u0645\u062a\u0627\u062d\u0629"}
          </div>
        )}
      </div>

      {/* ── channel info bar ────────────────────────────── */}
      {activeChannel && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            background: C.bgDeep,
            borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {activeChannel.name}
            </span>
            <span style={{ fontSize: 11, color: C.textMuted }}>
              {activeChannel.nameEn}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              fontWeight: 600,
              color: C.accent,
              background: "rgba(239,68,68,0.1)",
              padding: "2px 8px",
              borderRadius: 4,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <LiveDot size={6} />
            <span style={{ marginInlineStart: 2 }}>
              {"\u0645\u0628\u0627\u0634\u0631"}
            </span>
          </div>
        </div>
      )}

      {/* ── spacer (fills remaining height in sidebar) ──── */}
      <div style={{ flex: 1, background: C.bgPanel }} />
    </div>
  );
}
