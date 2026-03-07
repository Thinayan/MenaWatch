"use client";
import { useState, useEffect, useRef } from "react";

// ── بيانات احتياطية عند تعذر الاتصال ────────────────────────
const FALLBACK = [
  { sym: "TASI",    name: "تاسي",    val: "12,847", chg: "+0.41%", up: true },
  { sym: "2222",    name: "أرامكو",   val: "28.40",  chg: "+0.50%", up: true },
  { sym: "BRENT",   name: "برنت",     val: "$82.10", chg: "-0.80%", up: false },
  { sym: "GOLD",    name: "ذهب",      val: "$2,318", chg: "+0.30%", up: true },
  { sym: "USD/SAR", name: "دولار/ريال", val: "3.7500", chg: "+0.01%", up: true },
  { sym: "BTC/USD", name: "بتكوين",   val: "$67,420", chg: "+2.40%", up: true },
  { sym: "S&P500",  name: "S&P 500",  val: "5,412",  chg: "+0.22%", up: true },
  { sym: "DFM",     name: "دبي DFM",  val: "4,312",  chg: "+0.28%", up: true },
];

/**
 * StockTicker — شريط أسهم متحرك (marquee) يعرض بيانات السوق
 *
 * يسحب البيانات من /api/market-data كل 60 ثانية
 * ويعرضها في شريط متحرك مستمر.
 */
export default function StockTicker() {
  const [items, setItems] = useState(FALLBACK);
  const [isLive, setIsLive] = useState(false);
  const scrollRef = useRef(null);

  // ── جلب البيانات من API ───────────────────────
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const res = await fetch("/api/market-data");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();

        if (!mounted) return;

        // ── دمج البيانات من 3 مصادر: markets + stocks + currencies
        const merged = [];

        // الأسواق الخليجية
        if (data.markets) {
          data.markets.forEach(m => {
            merged.push({ sym: m.id?.toUpperCase() || m.name, name: m.name, val: m.val, chg: m.chg, up: m.up });
          });
        }

        // أسهم مختارة
        if (data.stocks) {
          data.stocks.slice(0, 3).forEach(s => {
            merged.push({ sym: s.sym, name: s.name, val: s.val, chg: s.chg, up: s.up });
          });
        }

        // عملات
        if (data.currencies) {
          data.currencies.forEach(c => {
            merged.push({ sym: c.pair, name: c.pair, val: c.val, chg: c.chg, up: c.up });
          });
        }

        if (merged.length > 0) {
          setItems(merged);
          setIsLive(data.source === "live");
        }
      } catch {
        // نبقي على البيانات الاحتياطية
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // ── نضاعف العناصر لتكرار سلس ────────────────
  const doubled = [...items, ...items];

  return (
    <div style={{
      background: "#070e1a",
      borderBottom: "1px solid #1e293b",
      overflow: "hidden",
      position: "relative",
      height: 32,
      display: "flex",
      alignItems: "center",
      direction: "ltr",
    }}>
      <style>{`
        @keyframes scrollTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* مؤشر "مباشر" */}
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        background: "linear-gradient(to left, #070e1a 60%, transparent)",
        zIndex: 2,
        paddingLeft: 12,
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: "50%",
          background: isLive ? "#22c55e" : "#f59e0b",
          display: "inline-block",
          animation: "pulse 1.5s infinite",
        }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: isLive ? "#22c55e" : "#f59e0b" }}>
          {isLive ? "LIVE" : "DEMO"}
        </span>
      </div>

      {/* Gradient edges */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 30, background: "linear-gradient(to right, #070e1a, transparent)", zIndex: 1 }} />

      {/* الشريط المتحرك */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          animation: `scrollTicker ${items.length * 4}s linear infinite`,
          whiteSpace: "nowrap",
        }}
      >
        {doubled.map((item, i) => (
          <div key={i} style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "0 16px",
            borderLeft: i > 0 ? "1px solid #1e293b22" : "none",
          }}>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
              {item.name}
            </span>
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#e2e8f0",
              fontVariantNumeric: "tabular-nums",
              fontFamily: "monospace, 'IBM Plex Sans Arabic'",
            }}>
              {item.val}
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: item.up === true ? "#22c55e" : item.up === false ? "#ef4444" : "#94a3b8",
              fontVariantNumeric: "tabular-nums",
            }}>
              {item.up === true ? "▲" : item.up === false ? "▼" : "—"} {item.chg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
