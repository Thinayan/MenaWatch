"use client";
import LiveNewsFeed from "../LiveNewsFeed";

const INDICATORS = [
  { country: "🇸🇦 السعودية", gdp: "$1.06T", growth: "+4.7%", inflation: "1.6%", unemployment: "4.9%", trade: "+$112B" },
  { country: "🇦🇪 الإمارات", gdp: "$507B", growth: "+3.9%", inflation: "2.3%", unemployment: "2.8%", trade: "+$58B" },
  { country: "🇶🇦 قطر", gdp: "$235B", growth: "+2.4%", inflation: "2.8%", unemployment: "0.1%", trade: "+$67B" },
  { country: "🇰🇼 الكويت", gdp: "$135B", growth: "+2.1%", inflation: "3.5%", unemployment: "2.2%", trade: "+$41B" },
  { country: "🇧🇭 البحرين", gdp: "$44B", growth: "+3.2%", inflation: "1.8%", unemployment: "3.7%", trade: "-$2B" },
  { country: "🇴🇲 عمان", gdp: "$104B", growth: "+2.7%", inflation: "1.1%", unemployment: "2.3%", trade: "+$16B" },
  { country: "🇪🇬 مصر", gdp: "$476B", growth: "+4.2%", inflation: "25.8%", unemployment: "7.1%", trade: "-$43B" },
  { country: "🇮🇶 العراق", gdp: "$264B", growth: "+2.8%", inflation: "4.5%", unemployment: "15.5%", trade: "+$22B" },
  { country: "🇮🇷 إيران", gdp: "$389B", growth: "+3.0%", inflation: "40.0%", unemployment: "9.7%", trade: "+$8B" },
  { country: "🇯🇴 الأردن", gdp: "$46B", growth: "+2.5%", inflation: "2.1%", unemployment: "22.9%", trade: "-$11B" },
];

const MACRO_CARDS = [
  { label: "إجمالي GDP منطقة MENA", val: "$3.8T", chg: "+3.4%", color: "#ec4899" },
  { label: "متوسط التضخم", val: "8.7%", chg: "↓ 1.2%", color: "#f59e0b" },
  { label: "الاحتياطيات الأجنبية", val: "$1.2T", chg: "+2.1%", color: "#22c55e" },
  { label: "الاستثمار الأجنبي المباشر", val: "$42B", chg: "+18%", color: "#3b82f6" },
];

export default function TabIndicators() {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Macro Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {MACRO_CARDS.map(m => (
          <div key={m.label} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#475569" }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.val}</div>
            <div style={{ fontSize: 10, color: m.chg.includes("+") || m.chg.includes("↓") ? "#22c55e" : "#ef4444" }}>{m.chg}</div>
          </div>
        ))}
      </div>

      {/* Indicators Table */}
      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>📊 المؤشرات الاقتصادية لدول MENA</div>
        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "120px 80px 60px 60px 70px 70px", padding: "8px 14px", background: "#080f1c", borderBottom: "1px solid #1e293b", fontSize: 10, color: "#475569", fontWeight: 600 }}>
            <span>الدولة</span><span style={{ textAlign: "center" }}>GDP</span><span style={{ textAlign: "center" }}>النمو</span><span style={{ textAlign: "center" }}>تضخم</span><span style={{ textAlign: "center" }}>بطالة</span><span style={{ textAlign: "center" }}>ميزان تجاري</span>
          </div>
          {INDICATORS.map(c => (
            <div key={c.country} style={{ display: "grid", gridTemplateColumns: "120px 80px 60px 60px 70px 70px", padding: "10px 14px", borderBottom: "1px solid #0f1829", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{c.country}</span>
              <span style={{ fontSize: 11, color: "#f8fafc", textAlign: "center", fontWeight: 700 }}>{c.gdp}</span>
              <span style={{ fontSize: 10, color: "#22c55e", textAlign: "center" }}>{c.growth}</span>
              <span style={{ fontSize: 10, color: parseFloat(c.inflation) > 10 ? "#ef4444" : "#f59e0b", textAlign: "center" }}>{c.inflation}</span>
              <span style={{ fontSize: 10, color: parseFloat(c.unemployment) > 10 ? "#ef4444" : "#94a3b8", textAlign: "center" }}>{c.unemployment}</span>
              <span style={{ fontSize: 10, color: c.trade.startsWith("+") ? "#22c55e" : "#ef4444", textAlign: "center", fontWeight: 700 }}>{c.trade}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Economic News */}
      <LiveNewsFeed
        category="economic"
        title="📰 آخر الأخبار الاقتصادية"
        limit={5}
      />
    </div>
  );
}
