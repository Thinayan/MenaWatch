"use client";
import { useState, useEffect, useCallback } from "react";
import BroadcastGrid from "./BroadcastGrid";

import TabHealth from "./tabs/TabHealth";
import TabTransport from "./tabs/TabTransport";
import TabIndicators from "./tabs/TabIndicators";
import TabReports from "./tabs/TabReports";
import TabRealEstate from "./tabs/TabRealEstate";
import TabTelecom from "./tabs/TabTelecom";
import TabTourism from "./tabs/TabTourism";
import TabFood from "./tabs/TabFood";

const FONT_URL = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap";

const LIVE_STREAMS = [
  { id: "alarabiya", name: "العربية", url: "https://www.youtube.com/embed/live_stream?channel=UCahpxixMCwoANAftn6IxkTg&autoplay=1", thumb: "📺" },
  { id: "alhadath", name: "الحدث", url: "https://www.youtube.com/embed/live_stream?channel=UCrj5BGAhtWxDfqbza9T9hqA&autoplay=1", thumb: "🔴" },
  { id: "ekhbariya", name: "الإخبارية", url: "https://www.youtube.com/embed/live_stream?channel=UCV01ajGl6nt09h40iDoHDNg&autoplay=1", thumb: "🇸🇦" },
  { id: "aljazeera", name: "الجزيرة", url: "https://www.youtube.com/embed/live_stream?channel=UCfiwzLy-8yKzIbsmZTzxDgw&autoplay=1", thumb: "📷" },
  { id: "france24", name: "فرانس 24", url: "https://www.youtube.com/embed/live_stream?channel=UCdTyuXgmJkG_O8_75eqej-w&autoplay=1", thumb: "🇫🇷" },
  { id: "dw", name: "DW عربية", url: "https://www.youtube.com/embed/live_stream?channel=UC30ditU5JI16o5NbFsHde_Q&autoplay=1", thumb: "🇩🇪" },
];

const GEO = [
  { name: "السعودية", code: "SA", risk: 5, trend: "↑", events: 5, gdp: "1.06T" },
  { name: "الإمارات", code: "AE", risk: 5, trend: "↑", events: 3, gdp: "507B" },
  { name: "قطر", code: "QA", risk: 5, trend: "↑", events: 2, gdp: "235B" },
  { name: "الكويت", code: "KW", risk: 5, trend: "↑", events: 4, gdp: "135B" },
  { name: "البحرين", code: "BH", risk: 4, trend: "↑", events: 6, gdp: "44B" },
  { name: "عمان", code: "OM", risk: 5, trend: "↑", events: 3, gdp: "104B" },
  { name: "العراق", code: "IQ", risk: 4, trend: "↓", events: 19, gdp: "264B" },
  { name: "إيران", code: "IR", risk: 3, trend: "↓", events: 34, gdp: "389B" },
  { name: "لبنان", code: "LB", risk: 4, trend: "→", events: 15, gdp: "21B" },
  { name: "سوريا", code: "SY", risk: 3, trend: "↓", events: 22, gdp: "60B" },
  { name: "اليمن", code: "YE", risk: 2, trend: "↓", events: 47, gdp: "25B" },
  { name: "مصر", code: "EG", risk: 4, trend: "↑", events: 12, gdp: "476B" },
  { name: "الأردن", code: "JO", risk: 5, trend: "↑", events: 4, gdp: "46B" },
  { name: "السودان", code: "SD", risk: 3, trend: "↓", events: 28, gdp: "48B" },
  { name: "ليبيا", code: "LY", risk: 3, trend: "↓", events: 18, gdp: "53B" },
];

const MARKETS_FB = [
  { id: "tasi", name: "تاسي", val: "12,847", chg: "+0.41%", up: true, flag: "🇸🇦" },
  { id: "dfm", name: "دبي DFM", val: "4,312", chg: "+0.28%", up: true, flag: "🇦🇪" },
  { id: "adx", name: "أبوظبي ADX", val: "9,124", chg: "-0.12%", up: false, flag: "🇦🇪" },
  { id: "qe", name: "قطر QE", val: "10,218", chg: "+0.18%", up: true, flag: "🇶🇦" },
  { id: "bhb", name: "البحرين BHB", val: "1,904", chg: "+0.05%", up: true, flag: "🇧🇭" },
  { id: "msm", name: "مسقط MSM", val: "4,587", chg: "-0.08%", up: false, flag: "🇴🇲" },
];

const STOCKS_FB = [
  { name: "أرامكو", sym: "2222", sector: "طاقة", val: "28.40", chg: "+0.5%", up: true },
  { name: "سابك", sym: "2010", sector: "بتروكيماويات", val: "73.80", chg: "-0.3%", up: false },
  { name: "الراجحي", sym: "1120", sector: "بنوك", val: "84.50", chg: "+1.2%", up: true },
  { name: "STC", sym: "7010", sector: "اتصالات", val: "43.70", chg: "+0.8%", up: true },
  { name: "معادن", sym: "1211", sector: "مناجم", val: "56.90", chg: "+2.1%", up: true },
];

const CURR_FB = [
  { pair: "USD/SAR", val: "3.7500", chg: "+0.01%", up: true },
  { pair: "EUR/SAR", val: "4.0420", chg: "-0.08%", up: false },
  { pair: "GBP/SAR", val: "4.7210", chg: "+0.12%", up: true },
  { pair: "AED/SAR", val: "1.0203", chg: "0.00%", up: null },
  { pair: "KWD/SAR", val: "12.187", chg: "+0.03%", up: true },
  { pair: "BTC/USD", val: "67,420", chg: "+2.40%", up: true },
];

const ENERGY = [
  { name: "برنت", icon: "🛢️", val: "$85.40", unit: "$/barrel", chg: "+1.2%", up: true },
  { name: "WTI", icon: "🛢️", val: "$81.20", unit: "$/barrel", chg: "+0.9%", up: true },
  { name: "LNG", icon: "⛽", val: "$12.60", unit: "$/MBtu", chg: "+0.7%", up: true },
  { name: "فحم", icon: "🪨", val: "$134.5", unit: "$/ton", chg: "-0.2%", up: false },
];

const OPEC = [
  { date: "مارس 2025", dec: "تمديد خفض الإنتاج 2.2 مليون برميل/يوم حتى نهاية 2025", impact: "صاعد" },
  { date: "يناير 2025", dec: "تأجيل زيادة الإنتاج واستقرار حصص الأعضاء", impact: "محايد" },
  { date: "ديسمبر 2024", dec: "تأجيل رفع الإنتاج حتى الربع الثاني 2025", impact: "صاعد" },
];

const CMA_SECTORS = [
  { name: "البنوك والخدمات المالية", count: 42, mcap: "4.2", chg: "+1.2%" },
  { name: "الطاقة والبتروكيماويات", count: 28, mcap: "2.8", chg: "+0.5%" },
  { name: "الاتصالات والتقنية", count: 18, mcap: "0.8", chg: "+2.1%" },
  { name: "الزراعة والأغذية", count: 44, mcap: "0.6", chg: "-0.3%" },
  { name: "الصحة والإنتاج", count: 56, mcap: "1.1", chg: "+0.8%" },
  { name: "التجزئة والاستهلاك", count: 48, mcap: "0.7", chg: "+1.5%" },
  { name: "الرياضة الصحية", count: 24, mcap: "0.5", chg: "+3.2%" },
];

const VISION_KPI = [
  { label: "GDP غير نفطي", val: "50%", target: "50%", p: 100, color: "#22c55e" },
  { label: "توطين الوظائف", val: "30%", target: "30%", p: 100, color: "#22c55e" },
  { label: "السياحة/GDP", val: "10%", target: "10%", p: 100, color: "#22c55e" },
  { label: "الترفيه", val: "15", target: "10", p: 75, color: "#f59e0b" },
  { label: "طاقة متجددة", val: "18%", target: "50%", p: 36, color: "#3b82f6" },
  { label: "جودة الحياة", val: "72/100", target: "80", p: 90, color: "#8b5cf6" },
];

const VISION_PROJ = [
  { name: "نيوم", budget: "$500B", jobs: "380K", p: 12, color: "#22c55e" },
  { name: "القدية", budget: "$8B", jobs: "67K", p: 35, color: "#3b82f6" },
  { name: "البحر الأحمر", budget: "$28B", jobs: "35K", p: 48, color: "#f59e0b" },
  { name: "روشن", budget: "$20B", jobs: "200K", p: 62, color: "#8b5cf6" },
  { name: "درعية", budget: "$63B", jobs: "100K", p: 55, color: "#ec4899" },
  { name: "أمالا", budget: "$10B", jobs: "70K", p: 28, color: "#06b6d4" },
];

const RC = r => r<=1?"#7f1d1d":r===2?"#ef4444":r===3?"#f97316":r===4?"#f59e0b":"#22c55e";
const RL = r => r<=1?"حرج":r===2?"عالي":r===3?"متوسط":r===4?"معتدل":"مستقر";

function TabLive() {
  return <BroadcastGrid />;
}

function TabGeo() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = GEO.filter(c => {
    const mF = filter==="all" || (filter==="high"&&c.risk<=3) || (filter==="stable"&&c.risk>=5);
    return mF && c.name.includes(search);
  });
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
        {[1,2,3,4,5].map(lvl => {
          const count = GEO.filter(c => c.risk===lvl).length;
          return <div key={lvl} style={{ background: RC(lvl)+"18", border: "1px solid "+RC(lvl)+"44", borderRadius: 8, padding: "10px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: RC(lvl) }}>{count}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: RC(lvl) }}>{RL(lvl)}</div>
          </div>;
        })}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {[{id:"all",label:"الكل"},{id:"high",label:"🔴 مخاطر عالية"},{id:"stable",label:"🟢 مستقرة"}].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: "5px 12px", borderRadius: 5, cursor: "pointer", border: "1px solid",
            fontFamily: "inherit", fontSize: 11,
            background: filter===f.id?"#22c55e22":"#0a1628",
            borderColor: filter===f.id?"#22c55e":"#1e293b",
            color: filter===f.id?"#22c55e":"#64748b",
          }}>{f.label}</button>
        ))}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 ابحث عن دولة..."
          style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, padding: "5px 12px", color: "#e2e8f0", fontSize: 11, fontFamily: "inherit", outline: "none", width: 150, marginRight: "auto" }} />
      </div>
      <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 80px 50px 50px", padding: "8px 14px", background: "#080f1c", borderBottom: "1px solid #1e293b", fontSize: 10, color: "#475569", fontWeight: 600 }}>
          <span>الدولة</span><span style={{ textAlign: "center" }}>المستوى</span><span style={{ textAlign: "center" }}>الأحداث</span><span style={{ textAlign: "center" }}>الاتجاه</span><span style={{ textAlign: "center" }}>GDP</span>
        </div>
        {filtered.map(c => (
          <div key={c.code} style={{ display: "grid", gridTemplateColumns: "1fr 60px 80px 50px 50px", padding: "10px 14px", borderBottom: "1px solid #0f1829", alignItems: "center" }}
            onMouseEnter={e => e.currentTarget.style.background="#0f1829"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: RC(c.risk), flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{c.name}</div>
                <div style={{ fontSize: 9, color: "#334155" }}>{c.code}</div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, background: RC(c.risk)+"22", color: RC(c.risk) }}>{c.risk}</span>
            </div>
            <div style={{ textAlign: "center", fontSize: 12, color: c.events>20?"#ef4444":c.events>10?"#f59e0b":"#22c55e" }}>{c.events}</div>
            <div style={{ textAlign: "center", fontSize: 14, color: c.trend==="↓"?"#ef4444":c.trend==="→"?"#64748b":"#22c55e" }}>{c.trend}</div>
            <div style={{ textAlign: "center", fontSize: 10, color: "#94a3b8" }}>{c.gdp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabMarket() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchData = useCallback(() => {
    fetch("/api/market-data")
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLastUpdate(new Date().toLocaleTimeString("ar-SA", { timeZone: "Asia/Riyadh", hour: "2-digit", minute: "2-digit" }));
        setLoading(false);
      })
      .catch(() => {
        setData({ markets: MARKETS_FB, stocks: STOCKS_FB, currencies: CURR_FB, source: "fallback" });
        setLoading(false);
      });
  }, []);

  useEffect(() => { fetchData(); const iv = setInterval(fetchData, 60000); return () => clearInterval(iv); }, [fetchData]);

  const mkts = data?.markets || MARKETS_FB;
  const stks = data?.stocks || STOCKS_FB;
  const currs = data?.currencies || CURR_FB;

  if (loading) return <div style={{ padding: 32, textAlign: "center", color: "#22c55e" }}>جارٍ تحميل بيانات الأسواق...</div>;

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#64748b" }}>🕐 آخر تحديث: {lastUpdate}</span>
        <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 3, background: data?.source==="live"?"#14532d":"#1e293b", color: data?.source==="live"?"#22c55e":"#64748b" }}>
          {data?.source==="live" ? "بيانات حية" : "بيانات نموذجية"}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>📈 مؤشرات البورصات الخليجية</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {mkts.map(m => (
            <div key={m.id} style={{ background: "#0a1628", border: "1px solid "+(m.up?"#22c55e22":"#ef444422"), borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{m.flag} {m.name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: m.up?"#22c55e":"#ef4444" }}>{m.chg}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc", fontVariantNumeric: "tabular-nums" }}>{m.val}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>🏆 أبرز الأسهم السعودية</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {stks.map(s => (
            <div key={s.sym} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: s.up?"#14532d":"#7f1d1d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: s.up?"#22c55e":"#ef4444", flexShrink: 0 }}>{s.sym}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{s.name}</div>
                <div style={{ fontSize: 9, color: "#475569" }}>{s.sector}</div>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f8fafc" }}>{s.val}</div>
                <div style={{ fontSize: 10, color: s.up?"#22c55e":"#ef4444" }}>{s.chg}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>💱 العملات والأصول الرقمية</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
          {currs.map(c => (
            <div key={c.pair} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10, color: "#64748b" }}>{c.pair}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", fontVariantNumeric: "tabular-nums" }}>{c.val}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: c.up===true?"#22c55e":c.up===false?"#ef4444":"#64748b" }}>{c.chg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabEnergy() {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>⚡ أسعار الطاقة اللحظية</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
          {ENERGY.map(e => (
            <div key={e.name} style={{ background: "#0a1628", border: "1px solid "+(e.up?"#22c55e22":"#ef444422"), borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{e.icon}</div>
              <div style={{ fontSize: 10, color: "#64748b" }}>{e.name}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc" }}>{e.val}</div>
              <div style={{ fontSize: 9, color: "#475569" }}>{e.unit}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: e.up?"#22c55e":"#ef4444", marginTop: 4 }}>{e.chg}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>🛢️ قرارات أوبك+</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {OPEC.map((d,i) => (
            <div key={i} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, padding: "10px 14px", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, width: 80, fontSize: 10, color: "#475569", paddingTop: 1 }}>{d.date}</div>
              <div style={{ flex: 1, fontSize: 11, color: "#cbd5e1", lineHeight: 1.6 }}>{d.dec}</div>
              <span style={{ flexShrink: 0, fontSize: 9, padding: "2px 8px", borderRadius: 3, background: d.impact==="صاعد"?"#14532d":"#1e293b", color: d.impact==="صاعد"?"#22c55e":"#64748b" }}>{d.impact}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#0a1628", border: "1px solid #22c55e33", borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", marginBottom: 10 }}>🇸🇦 أهداف الطاقة السعودية — رؤية 2030</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {[
            { label: "طاقة متجددة", target: "50%", current: "18%", p: 36 },
            { label: "خفض انبعاثات", target: "278M طن", current: "112M", p: 40 },
            { label: "كفاءة الطاقة", target: "43%", current: "28%", p: 65 },
          ].map(t => (
            <div key={t.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#64748b", marginBottom: 4 }}>{t.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#22c55e" }}>{t.current}</div>
              <div style={{ fontSize: 9, color: "#475569", marginBottom: 4 }}>هدف: {t.target}</div>
              <div style={{ background: "#1e293b", borderRadius: 3, height: 4, overflow: "hidden" }}>
                <div style={{ width: t.p+"%", height: "100%", background: "#22c55e", borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 9, color: "#22c55e", marginTop: 2 }}>{t.p}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabCMA() {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "linear-gradient(135deg,#0a1628,#0f2040)", border: "1px solid #1e3a5f", borderRadius: 10, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>🏛️</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc" }}>هيئة السوق المالية السعودية</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>Capital Market Authority — CMA</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {[
            { label: "الشركات المدرجة", val: "322", color: "#3b82f6" },
            { label: "القيمة السوقية", val: "12.4T", color: "#22c55e", unit: "ريال" },
            { label: "التداول اليومي", val: "8.2B", color: "#f59e0b", unit: "ريال" },
            { label: "مستثمرو تداول", val: "11.4M", color: "#8b5cf6" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#475569", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
              {s.unit && <div style={{ fontSize: 9, color: "#334155" }}>{s.unit}</div>}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>📊 القطاعات المدرجة</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {CMA_SECTORS.map(s => (
            <div key={s.name} style={{ display: "grid", gridTemplateColumns: "1fr 60px 120px 60px", alignItems: "center", gap: 12, background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, padding: "8px 12px" }}>
              <span style={{ fontSize: 11, color: "#e2e8f0" }}>{s.name}</span>
              <span style={{ fontSize: 10, color: "#64748b", textAlign: "center" }}>{s.count} شركة</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ flex: 1, height: 4, background: "#1e293b", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: Math.min(parseFloat(s.mcap)/4.5*100,100)+"%", height: "100%", background: "#3b82f6", borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 9, color: "#64748b", flexShrink: 0 }}>{s.mcap}T</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: s.chg.startsWith("+")?"#22c55e":"#ef4444" }}>{s.chg}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { name: "موقع CMA", url: "https://www.cma.org.sa", icon: "🏛️" },
          { name: "تداول", url: "https://www.tadawul.com.sa", icon: "📈" },
          { name: "صندوق PIF", url: "https://www.pif.gov.sa", icon: "💰" },
          { name: "MISA", url: "https://misa.gov.sa", icon: "🏗️" },
        ].map(l => (
          <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "10px", background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, textDecoration: "none", textAlign: "center", transition: "border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor="#3b82f6"} onMouseLeave={e => e.currentTarget.style.borderColor="#1e293b"}>
            <div style={{ fontSize: 18 }}>{l.icon}</div>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>{l.name}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function TabVision() {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "linear-gradient(135deg,#0a1f0a,#0f2d0f)", border: "1px solid #22c55e44", borderRadius: 12, padding: 16, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>الإنجاز الكلي — رؤية المملكة العربية السعودية 2030</div>
        <div style={{ fontSize: 64, fontWeight: 900, color: "#22c55e", lineHeight: 1 }}>73%</div>
        <div style={{ fontSize: 11, color: "#16a34a", marginTop: 4 }}>متقدم على الجدول الزمني ✅</div>
        <div style={{ background: "#0a1628", borderRadius: 6, height: 8, margin: "12px 0 4px", overflow: "hidden" }}>
          <div style={{ width: "73%", height: "100%", background: "linear-gradient(90deg,#22c55e,#16a34a)", borderRadius: 6 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#475569" }}>
          <span>2016</span><span>الهدف 2030</span>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>📊 المؤشرات الرئيسية</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {VISION_KPI.map(k => (
            <div key={k.label} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, padding: "8px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: "#cbd5e1" }}>{k.label}</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#475569" }}>هدف: {k.target}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: k.color }}>{k.val}</span>
                  {k.p >= 100 && <span style={{ fontSize: 10 }}>✅</span>}
                </div>
              </div>
              <div style={{ background: "#1e293b", borderRadius: 3, height: 4, overflow: "hidden" }}>
                <div style={{ width: Math.min(k.p,100)+"%", height: "100%", background: k.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>🏗️ المشاريع الكبرى</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
          {VISION_PROJ.map(p => (
            <div key={p.name} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0" }}>{p.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 10, color: "#64748b" }}>
                <span>الميزانية: {p.budget}</span><span>وظائف: {p.jobs}</span>
              </div>
              <div style={{ background: "#1e293b", borderRadius: 3, height: 6, overflow: "hidden" }}>
                <div style={{ width: p.p+"%", height: "100%", background: p.color, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: p.color, marginTop: 3 }}>{p.p}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: "live",       label: "بث مباشر",   icon: "📡", color: "#ef4444",  comp: TabLive },
  { id: "geo",        label: "جيوسياسي",   icon: "🌍", color: "#f97316",  comp: TabGeo },
  { id: "market",     label: "الأسواق",    icon: "📈", color: "#f59e0b",  comp: TabMarket },
  { id: "energy",     label: "الطاقة",     icon: "⚡", color: "#3b82f6",  comp: TabEnergy },
  { id: "cma",        label: "هيئة CMA",   icon: "🏛️", color: "#8b5cf6",  comp: TabCMA },
  { id: "vision",     label: "رؤية 2030",  icon: "🚀", color: "#22c55e",  comp: TabVision },
  { id: "health",     label: "الصحة",      icon: "🏥", color: "#10b981",  comp: TabHealth },
  { id: "transport",  label: "النقل",      icon: "✈️", color: "#6366f1",  comp: TabTransport },
  { id: "indicators", label: "المؤشرات",   icon: "📊", color: "#ec4899",  comp: TabIndicators },
  { id: "reports",    label: "التقارير",   icon: "📋", color: "#14b8a6",  comp: TabReports },
  { id: "realestate", label: "العقارات",   icon: "🏗️", color: "#f97316",  comp: TabRealEstate },
  { id: "telecom",    label: "الاتصالات",  icon: "📶", color: "#0ea5e9",  comp: TabTelecom },
  { id: "tourism",    label: "السياحة",    icon: "🏖️", color: "#a855f7",  comp: TabTourism },
  { id: "food",       label: "الأغذية",    icon: "🌾", color: "#84cc16",  comp: TabFood },
];

export default function FreeTabs() {
  const [active, setActive] = useState("live");
  const [time, setTime] = useState(new Date());
  const [user, setUser] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    import("../../lib/supabase").then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }).catch(() => {});
  }, []);

  const saudiTime = time.toLocaleTimeString("ar-SA", { timeZone: "Asia/Riyadh", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const tab = TABS.find(t => t.id === active);
  const ActiveComp = tab?.comp;

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", background: "#060d18", minHeight: "100vh", color: "#e2e8f0", direction: "rtl", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('${FONT_URL}');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn 0.3s ease}
      `}</style>



      {/* Sub Bar */}
      <div style={{ background: "#080f1c", borderBottom: "1px solid #1e293b", padding: "0 20px", display: "flex", alignItems: "center", gap: 14, height: 36, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "pulse 1s infinite" }} />
          <span style={{ fontSize: 10, color: "#ef4444", fontWeight: 700 }}>مباشر</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", fontVariantNumeric: "tabular-nums" }}>{saudiTime}</div>
      </div>

      {/* Tab Bar */}
      <div style={{ background: "#080f1c", borderBottom: "1px solid #1e293b", padding: "0 20px", display: "flex", gap: 2, flexShrink: 0, overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} style={{
            padding: "11px 18px", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
            background: "transparent", border: "none", cursor: "pointer", whiteSpace: "nowrap",
            color: active===t.id ? t.color : "#64748b",
            borderBottom: `2px solid ${active===t.id ? t.color : "transparent"}`,
            display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
          }}>
            <span>{t.icon}</span> {t.label}
            {t.id==="live" && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "pulse 1s infinite" }} />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="fade-in" key={active} style={{ flex: 1, overflow: "auto" }}>
        {ActiveComp && <ActiveComp />}
      </div>
    </div>
  );
}
