"use client";
import LiveNewsFeed from "../LiveNewsFeed";

const FOOD_STATS = [
  { label: "الأمن الغذائي MENA", val: "62/100", icon: "🌾", color: "#84cc16" },
  { label: "واردات غذائية", val: "$85B/سنة", icon: "🚢", color: "#f59e0b" },
  { label: "مشاريع زراعية", val: "120+", icon: "🌱", color: "#22c55e" },
  { label: "اكتفاء ذاتي", val: "35%", icon: "📊", color: "#3b82f6" },
];

const FOOD_SECURITY = [
  { country: "🇸🇦 السعودية", index: 72, imports: "$22B", selfSufficiency: "42%", strategy: "برنامج التحول الزراعي 2025" },
  { country: "🇦🇪 الإمارات", index: 78, imports: "$12B", selfSufficiency: "15%", strategy: "الأمن الغذائي 2051" },
  { country: "🇶🇦 قطر", index: 65, imports: "$3.2B", selfSufficiency: "12%", strategy: "المزارع الذكية" },
  { country: "🇪🇬 مصر", index: 58, imports: "$18B", selfSufficiency: "55%", strategy: "مليون فدان جديد" },
  { country: "🇰🇼 الكويت", index: 60, imports: "$4.8B", selfSufficiency: "8%", strategy: "الزراعة العمودية" },
  { country: "🇴🇲 عمان", index: 63, imports: "$3.5B", selfSufficiency: "32%", strategy: "تحلية مياه زراعية" },
];

const AG_PROJECTS = [
  { name: "NEOM Food Systems", budget: "$2B", type: "زراعة عمودية + AI", status: "تطوير", color: "#84cc16" },
  { name: "Pure Harvest", budget: "$500M", type: "صوبات ذكية — الإمارات", status: "تشغيل", color: "#22c55e" },
  { name: "مشروع القصيم الزراعي", budget: "$1.2B", type: "قمح + تمور — السعودية", status: "توسعة", color: "#f59e0b" },
  { name: "Madar Farms", budget: "$200M", type: "زراعة داخلية — أبوظبي", status: "تشغيل", color: "#3b82f6" },
  { name: "Mezzan Holding", budget: "$800M", type: "توزيع أغذية — الكويت", status: "نشط", color: "#8b5cf6" },
];

const FOOD_NEWS = [
  { title: "السعودية تحقق اكتفاء ذاتي 65% في الدواجن", date: "5 مارس 2026", tag: "إنجاز" },
  { title: "الإمارات تطلق أكبر مزرعة عمودية في الشرق الأوسط", date: "3 مارس 2026", tag: "ابتكار" },
  { title: "مصر توقع اتفاقية استيراد قمح بـ $4.2B", date: "1 مارس 2026", tag: "تجارة" },
];

export default function TabFood() {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {FOOD_STATS.map(s => (
          <div key={s.label} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 9, color: "#475569" }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>🌾 مؤشر الأمن الغذائي</div>
        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 70px 60px 1fr", padding: "8px 14px", background: "#080f1c", borderBottom: "1px solid #1e293b", fontSize: 10, color: "#475569", fontWeight: 600 }}>
            <span>الدولة</span><span style={{ textAlign: "center" }}>المؤشر</span><span style={{ textAlign: "center" }}>الواردات</span><span style={{ textAlign: "center" }}>اكتفاء</span><span style={{ textAlign: "center" }}>الاستراتيجية</span>
          </div>
          {FOOD_SECURITY.map(c => (
            <div key={c.country} style={{ display: "grid", gridTemplateColumns: "1fr 60px 70px 60px 1fr", padding: "10px 14px", borderBottom: "1px solid #0f1829", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{c.country}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: c.index >= 70 ? "#22c55e" : c.index >= 60 ? "#f59e0b" : "#ef4444", textAlign: "center" }}>{c.index}</span>
              <span style={{ fontSize: 10, color: "#94a3b8", textAlign: "center" }}>{c.imports}</span>
              <span style={{ fontSize: 10, color: "#84cc16", textAlign: "center" }}>{c.selfSufficiency}</span>
              <span style={{ fontSize: 9, color: "#64748b", textAlign: "center" }}>{c.strategy}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>🌱 مشاريع زراعية وغذائية</div>
        {AG_PROJECTS.map(p => (
          <div key={p.name} style={{ background: "#0a1628", border: `1px solid ${p.color}33`, borderRadius: 6, padding: "10px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{p.name}</div>
              <div style={{ fontSize: 9, color: "#475569" }}>{p.type} | الميزانية: {p.budget}</div>
            </div>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 3, background: p.color + "22", color: p.color }}>{p.status}</span>
          </div>
        ))}
      </div>

      {/* Live Food News */}
      <LiveNewsFeed
        category="general"
        title="📰 أخبار الأغذية والزراعة"
        limit={5}
        fallbackNews={FOOD_NEWS}
      />
    </div>
  );
}
