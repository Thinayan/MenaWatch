"use client";

import { useState, useEffect } from "react";

const SECTIONS = [
  {
    id: "main",
    title: "\u0631\u0626\u064a\u0633\u064a \u0648\u0633\u0639\u0648\u062f\u064a",
    icon: "\ud83c\uddf8\ud83c\udde6",
    color: "#22c55e",
    channels: [
      { id: "alarabiya", name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", channelId: "UCahpxixMCwoANAftn6IxkTg" },
      { id: "alhadath", name: "\u0627\u0644\u062d\u062f\u062b", channelId: "UCrj5BGAhtWxDfqbza9T9hqA" },
      { id: "ekhbariya", name: "\u0627\u0644\u0625\u062e\u0628\u0627\u0631\u064a\u0629", channelId: "UCV01ajGl6nt09h40iDoHDNg" },
    ],
  },
  {
    id: "political",
    title: "\u0633\u064a\u0627\u0633\u064a \u062f\u0648\u0644\u064a",
    icon: "\ud83c\udf0d",
    color: "#ef4444",
    channels: [
      { id: "aljazeera", name: "\u0627\u0644\u062c\u0632\u064a\u0631\u0629", channelId: "UCfiwzLy-8yKzIbsmZTzxDgw" },
      { id: "aje", name: "\u0627\u0644\u062c\u0632\u064a\u0631\u0629 English", channelId: "UCNye-wNBqNL5ZzHSJj3l8Bg" },
      { id: "france24", name: "\u0641\u0631\u0627\u0646\u0633 24", channelId: "UCdTyuXgmJkG_O8_75eqej-w" },
      { id: "dw", name: "DW \u0639\u0631\u0628\u064a\u0629", channelId: "UC30ditU5JI16o5NbFsHde_Q" },
    ],
  },
  {
    id: "economy",
    title: "\u0627\u0642\u062a\u0635\u0627\u062f",
    icon: "\ud83d\udcbc",
    color: "#f59e0b",
    channels: [
      { id: "alarabiya_biz", name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0628\u0632\u0646\u0633", channelId: "UCahpxixMCwoANAftn6IxkTg" },
      { id: "aljazeera_biz", name: "\u0627\u0644\u062c\u0632\u064a\u0631\u0629 \u0627\u0642\u062a\u0635\u0627\u062f", channelId: "UCfiwzLy-8yKzIbsmZTzxDgw" },
    ],
  },
  {
    id: "energy",
    title: "\u0637\u0627\u0642\u0629",
    icon: "\u26a1",
    color: "#3b82f6",
    channels: [
      { id: "alarabiya_energy", name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0637\u0627\u0642\u0629", channelId: "UCahpxixMCwoANAftn6IxkTg" },
      { id: "ekhbariya_energy", name: "\u0627\u0644\u0625\u062e\u0628\u0627\u0631\u064a\u0629", channelId: "UCV01ajGl6nt09h40iDoHDNg" },
    ],
  },
  {
    id: "tech",
    title: "\u062a\u0642\u0646\u064a\u0629 \u0648\u0627\u062a\u0635\u0627\u0644\u0627\u062a",
    icon: "\ud83d\udcbb",
    color: "#8b5cf6",
    channels: [
      { id: "alarabiya_tech", name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u062a\u0642\u0646\u064a\u0629", channelId: "UCahpxixMCwoANAftn6IxkTg" },
      { id: "dw_tech", name: "DW \u062a\u0642\u0646\u064a\u0629", channelId: "UC30ditU5JI16o5NbFsHde_Q" },
    ],
  },
  {
    id: "emerging",
    title: "\u0623\u0633\u0648\u0627\u0642 \u0646\u0627\u0634\u0626\u0629",
    icon: "\ud83d\udcca",
    color: "#10b981",
    channels: [
      { id: "aljazeera_markets", name: "\u0627\u0644\u062c\u0632\u064a\u0631\u0629 \u0623\u0633\u0648\u0627\u0642", channelId: "UCfiwzLy-8yKzIbsmZTzxDgw" },
      { id: "france24_markets", name: "\u0641\u0631\u0627\u0646\u0633 24", channelId: "UCdTyuXgmJkG_O8_75eqej-w" },
    ],
  },
];

export default function BroadcastGrid() {
  const [activeChannels, setActiveChannels] = useState(() => {
    const initial = {};
    SECTIONS.forEach((s) => {
      initial[s.id] = s.channels[0].id;
    });
    return initial;
  });

  const [columns, setColumns] = useState(3);

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      if (w < 640) {
        setColumns(1);
      } else if (w < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChannelChange = (sectionId, channelId) => {
    setActiveChannels((prev) => ({ ...prev, [sectionId]: channelId }));
  };

  return (
    <div
      dir="rtl"
      style={{
        background: "#060d18",
        minHeight: "100vh",
        padding: 12,
        fontFamily: "'IBM Plex Sans Arabic', sans-serif",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 8,
        }}
      >
        {SECTIONS.map((section) => {
          const activeId = activeChannels[section.id];
          const channel = section.channels.find((c) => c.id === activeId);

          return (
            <div
              key={section.id}
              style={{
                background: "#0a1628",
                border: `1px solid ${section.color}33`,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {/* Section header */}
              <div
                style={{
                  padding: "6px 10px",
                  borderBottom: "1px solid #1e293b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    color: section.color,
                    fontWeight: 600,
                    fontSize: 13,
                    whiteSpace: "nowrap",
                  }}
                >
                  {section.icon} {section.title}
                </span>

                {/* Channel selector buttons */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {section.channels.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => handleChannelChange(section.id, ch.id)}
                      style={{
                        fontSize: 9,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background:
                          activeId === ch.id
                            ? section.color + "33"
                            : "transparent",
                        border: `1px solid ${
                          activeId === ch.id ? section.color : "#1e293b"
                        }`,
                        color:
                          activeId === ch.id ? section.color : "#64748b",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        lineHeight: 1.4,
                        transition: "all 0.15s ease",
                      }}
                    >
                      {ch.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* YouTube live stream iframe */}
              <div style={{ aspectRatio: "16/9", background: "#000" }}>
                <iframe
                  src={`https://www.youtube.com/embed/live_stream?channel=${channel.channelId}&autoplay=0&mute=1`}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
                  allowFullScreen
                  title={`${section.title} - ${channel.name}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
