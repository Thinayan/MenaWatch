"use client";

const TOURISM_STATS = [
  { label: "سياح 2025", val: "115M+", icon: "✈️", color: "#a855f7" },
  { label: "إيرادات السياحة", val: "$85B", icon: "💰", color: "#22c55e" },
  { label: "الهدف 2030", val: "150M", icon: "🎯", color: "#f59e0b" },
  { label: "مشاريع سياحية", val: "35+", icon: "🏗️", color: "#3b82f6" },
];

const DESTINATIONS = [
  { name: "البحر الأحمر", country: "🇸🇦", type: "ساحلي فاخر", visitors: "1M هدف", status: "افتتاح 2025", progress: 70, color: "#a855f7" },
  { name: "العلا", country: "🇸🇦", type: "تراث / ثقافي", visitors: "2M سنوياً", status: "مفتوح", progress: 85, color: "#f59e0b" },
  { name: "أمالا", country: "🇸🇦", type: "صحي فاخر", visitors: "500K هدف", status: "تحت الإنشاء", progress: 40, color: "#22c55e" },
  { name: "إكسبو سيتي دبي", country: "🇦🇪", type: "ترفيهي / أعمال", visitors: "10M+", status: "نشط", progress: 100, color: "#3b82f6" },
  { name: "لوسيل", country: "🇶🇦", type: "رياضي / ثقافي", visitors: "3M+", status: "نشط", progress: 90, color: "#ec4899" },
  { name: "سندالة", country: "🇸🇦", type: "جزيرة فاخرة", visitors: "هدف 2026", status: "تحت الإنشاء", progress: 55, color: "#0ea5e9" },
];

const BY_COUNTRY = [
  { country: "🇸🇦 السعودية", visitors: "27.4M", revenue: "$28B", growth: "+56%", target: "100M بحلول 2030" },
  { country: "🇦🇪 الإمارات", visitors: "25.3M", revenue: "$22B", growth: "+12%", target: "30M بحلول 2030" },
  { country: "🇶🇦 قطر", visitors: "5.6M", revenue: "$6B", growth: "+24%", target: "8M بحلول 2030" },
  { country: "🇪🇬 مصر", visitors: "14.9M", revenue: "$13B", growth: "+8%", target: "20M بحلول 2030" },
  { country: "🇴🇲 عمان", visitors: "3.8M", revenue: "$3.2B", growth: "+18%", target: "5M بحلول 2030" },
  { country: "🇧🇭 البحرين", visitors: "12.1M", revenue: "$4.5B", growth: "+10%", target: "15M بحلول 2030" },
];

export default function TabTourism() {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {TOURISM_STATS.map(s => (
          <div key={s.label} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 9, color: "#475569" }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>🏖️ أبرز الوجهات السياحية</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
          {DESTINATIONS.map(d => (
            <div key={d.name} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{d.country} {d.name}</span>
                <span style={{ fontSize: 9, color: d.color }}>{d.status}</span>
              </div>
              <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>{d.type} | {d.visitors}</div>
              <div style={{ background: "#1e293b", borderRadius: 3, height: 4, overflow: "hidden" }}>
                <div style={{ width: Math.min(d.progress, 100) + "%", height: "100%", background: d.color, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 9, color: d.color, marginTop: 2 }}>{d.progress}%</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>📊 السياحة حسب الدولة</div>
        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px 60px 1fr", padding: "8px 14px", background: "#080f1c", borderBottom: "1px solid #1e293b", fontSize: 10, color: "#475569", fontWeight: 600 }}>
            <span>الدولة</span><span style={{ textAlign: "center" }}>الزوار</span><span style={{ textAlign: "center" }}>الإيرادات</span><span style={{ textAlign: "center" }}>النمو</span><span style={{ textAlign: "center" }}>الهدف</span>
          </div>
          {BY_COUNTRY.map(c => (
            <div key={c.country} style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px 60px 1fr", padding: "10px 14px", borderBottom: "1px solid #0f1829", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{c.country}</span>
              <span style={{ fontSize: 10, color: "#a855f7", textAlign: "center" }}>{c.visitors}</span>
              <span style={{ fontSize: 10, color: "#94a3b8", textAlign: "center" }}>{c.revenue}</span>
              <span style={{ fontSize: 10, color: "#22c55e", textAlign: "center", fontWeight: 700 }}>{c.growth}</span>
              <span style={{ fontSize: 9, color: "#475569", textAlign: "center" }}>{c.target}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
