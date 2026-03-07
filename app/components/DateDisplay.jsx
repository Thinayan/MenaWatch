"use client";
import { useState, useEffect } from "react";

// ── تحويل الأرقام الهندية إلى غربية ─────────────────────────
export function toWestern(str) {
  if (!str) return str;
  return String(str)
    .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
}

// ── التاريخ الهجري ────────────────────────────────────────
function getHijriDate() {
  try {
    const hijri = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
      timeZone: "Asia/Riyadh",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
    return toWestern(hijri);
  } catch {
    return "";
  }
}

// ── التاريخ الميلادي (اسم اليوم + التاريخ) ──────────────
function getGregorianDate() {
  const raw = new Date().toLocaleDateString("ar-EG", {
    timeZone: "Asia/Riyadh",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return toWestern(raw);
}

// ── الوقت (غربي) ───────────────────────────────────────
function getTime() {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Riyadh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/**
 * DateDisplay — مكون تاريخ هجري + ميلادي + ساعة حية
 *
 * @param {"compact"|"full"|"inline"} variant
 *   - compact: ساعة + هجري + ميلادي (سطر واحد)
 *   - full: كل شيء مع خلفية
 *   - inline: هجري + ميلادي + ساعة (نص بسيط)
 */
export default function DateDisplay({ variant = "compact" }) {
  const [time, setTime] = useState("");
  const [hijri, setHijri] = useState("");
  const [greg, setGreg] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(getTime());
      setHijri(getHijriDate());
      setGreg(getGregorianDate());
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  // ── Inline (نص بسيط — هجري + ميلادي + ساعة) ──────
  if (variant === "inline") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1, fontVariantNumeric: "tabular-nums" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#22c55e", fontWeight: 700, letterSpacing: 1 }}>{time}</span>
          <span style={{ fontSize: 11, color: "#1e293b" }}>|</span>
          <span style={{ fontSize: 11, color: "#cbd5e1" }}>{hijri}</span>
        </div>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>{greg}</span>
      </div>
    );
  }

  // ── Compact (سطر واحد — ساعة + هجري + ميلادي) ─────
  if (variant === "compact") {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 12,
        color: "#94a3b8",
        fontVariantNumeric: "tabular-nums",
        direction: "rtl",
      }}>
        {/* الساعة */}
        <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>
          {time}
        </span>
        <span style={{ color: "#1e293b" }}>|</span>
        {/* هجري */}
        <span style={{ color: "#cbd5e1", fontSize: 11 }}>{hijri}</span>
        <span style={{ color: "#1e293b" }}>|</span>
        {/* ميلادي */}
        <span style={{ color: "#94a3b8", fontSize: 11 }}>{greg}</span>
      </div>
    );
  }

  // ── Full (مع خلفية) ───────────────────────
  return (
    <div style={{
      background: "#0a1628",
      border: "1px solid #1e293b",
      borderRadius: 8,
      padding: "8px 14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      direction: "rtl",
      fontVariantNumeric: "tabular-nums",
    }}>
      {/* الساعة */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#94a3b8" }}>توقيت الرياض</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#22c55e", letterSpacing: 1 }}>{time}</div>
      </div>

      <div style={{ width: 1, height: 28, background: "#1e293b" }} />

      {/* هجري */}
      <div style={{ textAlign: "center", flex: 1 }}>
        <div style={{ fontSize: 10, color: "#94a3b8" }}>التاريخ الهجري</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{hijri}</div>
      </div>

      <div style={{ width: 1, height: 28, background: "#1e293b" }} />

      {/* ميلادي */}
      <div style={{ textAlign: "center", flex: 1 }}>
        <div style={{ fontSize: 10, color: "#94a3b8" }}>التاريخ الميلادي</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>{greg}</div>
      </div>
    </div>
  );
}
