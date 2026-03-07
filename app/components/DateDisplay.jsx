"use client";
import { useState, useEffect } from "react";

// ── تنسيق الأرقام الغربية ────────────────────────────────
function toWestern(str) {
  return str
    .replace(/٠/g, "0").replace(/١/g, "1").replace(/٢/g, "2")
    .replace(/٣/g, "3").replace(/٤/g, "4").replace(/٥/g, "5")
    .replace(/٦/g, "6").replace(/٧/g, "7").replace(/٨/g, "8")
    .replace(/٩/g, "9");
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

// ── التاريخ الميلادي ──────────────────────────────────────
function getGregorianDate() {
  return new Date().toLocaleDateString("ar-EG", {
    timeZone: "Asia/Riyadh",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── الوقت ─────────────────────────────────────────────────
function getTime() {
  const t = new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Riyadh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return t;
}

/**
 * DateDisplay — مكون تاريخ هجري + ميلادي + ساعة حية
 *
 * @param {"compact"|"full"|"inline"} variant
 *   - compact: ساعة + هجري (سطر واحد)
 *   - full: كل شيء مع خلفية
 *   - inline: نص بسيط بدون خلفية
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

  // ── Inline (نص بسيط) ─────────────────────
  if (variant === "inline") {
    return (
      <span style={{ fontSize: 12, color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>
        {hijri} — {time}
      </span>
    );
  }

  // ── Compact (سطر واحد) ────────────────────
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
