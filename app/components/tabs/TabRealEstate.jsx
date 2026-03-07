"use client";

const MEGAPROJECTS = [
  { name: "نيوم", budget: "$500B", area: "26,500 km²", status: "تحت الإنشاء", progress: 12, color: "#22c55e" },
  { name: "روشن", budget: "$20B", units: "400K وحدة", status: "مرحلة 2", progress: 35, color: "#3b82f6" },
  { name: "البحر الأحمر", budget: "$28B", area: "28,000 km²", status: "تحت الإنشاء", progress: 48, color: "#f59e0b" },
  { name: "القدية", budget: "$8B", area: "367 km²", status: "تحت الإنشاء", progress: 35, color: "#8b5cf6" },
  { name: "درعية", budget: "$63B", area: "14 km²", status: "تحت الإنشاء", progress: 55, color: "#ec4899" },
  { name: "العلا", budget: "$15B", area: "22,561 km²", status: "مفتوح جزئياً", progress: 42, color: "#f97316" },
];

const PRICES = [
  { city: "الرياض", residential: "$3,200/م²", commercial: "$5,800/م²", trend: "+12%", up: true },
  { city: "جدة", residential: "$2,400/م²", commercial: "$4,200/م²", trend: "+8%", up: true },
  { city: "دبي", residential: "$4,800/م²", commercial: "$7,500/م²", trend: "+15%", up: true },
  { city: "أبوظبي", residential: "$3,600/م²", commercial: "$5,200/م²", trend: "+6%", up: true },
  { city: "الدوحة", residential: "$2,800/م²", commercial: "$4,600/م²", trend: "-2%", up: false },
];

const REITS = [
  { name: "الرياض ريت", val: "12.80", chg: "+1.4%", yield: "6.8%", up: true },
  { name: "الراجحي ريت", val: "9.45", chg: "+0.8%", yield: "7.2%", up: true },
  { name: "جدوى ريت", val: "11.20", chg: "-0.3%", yield: "6.5%", up: false },
  { name: "ملكية ريت", val: "8.90", chg: "+2.1%", yield: "7.8%", up: true },
];

export default function TabRealEstate() {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {[
          { label: "حجم السوق العقاري", val: "$1.2T", color: "#f97316" },
          { label: "مشاريع ضخمة نشطة", val: "24+", color: "#22c55e" },
          { label: "REITs مدرجة", val: "18", color: "#3b82f6" },
          { label: "نمو سنوي", val: "+9.3%", color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#475569" }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>🏗️ المشاريع الكبرى</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
          {MEGAPROJECTS.map(p => (
            <div key={p.name} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{p.name}</span>
                <span style={{ fontSize: 9, color: p.color }}>{p.status}</span>
              </div>
              <div style={{ fontSize: 10, color: "#64748b", marginBottom: 6 }}>الميزانية: {p.budget} | {p.area || p.units}</div>
              <div style={{ background: "#1e293b", borderRadius: 3, height: 4, overflow: "hidden" }}>
                <div style={{ width: p.progress + "%", height: "100%", background: p.color, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 9, color: p.color, marginTop: 2 }}>{p.progress}%</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>💰 أسعار العقارات</div>
        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 60px", padding: "8px 14px", background: "#080f1c", borderBottom: "1px solid #1e293b", fontSize: 10, color: "#475569", fontWeight: 600 }}>
            <span>المدينة</span><span style={{ textAlign: "center" }}>سكني</span><span style={{ textAlign: "center" }}>تجاري</span><span style={{ textAlign: "center" }}>الاتجاه</span>
          </div>
          {PRICES.map(p => (
            <div key={p.city} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 60px", padding: "10px 14px", borderBottom: "1px solid #0f1829", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{p.city}</span>
              <span style={{ fontSize: 10, color: "#94a3b8", textAlign: "center" }}>{p.residential}</span>
              <span style={{ fontSize: 10, color: "#94a3b8", textAlign: "center" }}>{p.commercial}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: p.up ? "#22c55e" : "#ef4444", textAlign: "center" }}>{p.trend}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>📈 صناديق REITs</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
          {REITS.map(r => (
            <div key={r.name} style={{ background: "#0a1628", border: `1px solid ${r.up ? "#22c55e22" : "#ef444422"}`, borderRadius: 6, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{r.name}</div>
                <div style={{ fontSize: 9, color: "#475569" }}>عائد: {r.yield}</div>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f8fafc" }}>{r.val}</div>
                <div style={{ fontSize: 10, color: r.up ? "#22c55e" : "#ef4444" }}>{r.chg}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
