"use client";
import LiveNewsFeed from "../LiveNewsFeed";

const CORRIDORS = [
  { name: "مضيق هرمز", traffic: "21M برميل/يوم", status: "مفتوح", risk: "متوسط", riskColor: "#f59e0b" },
  { name: "قناة السويس", traffic: "12% تجارة عالمية", status: "مفتوح", risk: "منخفض", riskColor: "#22c55e" },
  { name: "باب المندب", traffic: "4.8M برميل/يوم", status: "مقيّد", risk: "عالي", riskColor: "#ef4444" },
  { name: "مضيق ملقا", traffic: "16M برميل/يوم", status: "مفتوح", risk: "منخفض", riskColor: "#22c55e" },
];

const PORTS = [
  { name: "ميناء جبل علي", country: "🇦🇪", rank: "#9 عالمياً", teu: "14.8M TEU", growth: "+5.2%" },
  { name: "ميناء الملك عبدالله", country: "🇸🇦", rank: "#63 عالمياً", teu: "2.8M TEU", growth: "+12.1%" },
  { name: "ميناء صلالة", country: "🇴🇲", rank: "#78 عالمياً", teu: "3.2M TEU", growth: "+3.8%" },
  { name: "ميناء حمد", country: "🇶🇦", rank: "#84 عالمياً", teu: "1.9M TEU", growth: "+8.4%" },
];

const AIRPORTS = [
  { name: "مطار دبي الدولي", code: "DXB", pax: "89.1M", cargo: "2.7M طن", status: "الأول عالمياً" },
  { name: "مطار الملك خالد (الجديد)", code: "RUH", pax: "35M (هدف: 120M)", cargo: "1.2M طن", status: "توسعة" },
  { name: "مطار أبوظبي", code: "AUH", pax: "24.3M", cargo: "0.9M طن", status: "ميدفيلد جديد" },
  { name: "مطار حمد الدولي", code: "DOH", pax: "46.2M", cargo: "2.8M طن", status: "توسعة المرحلة 2" },
];

const LOGISTICS_NEWS = [
  { title: "نيوم تطلق مطار خليج نيوم الدولي — أولى الرحلات 2026", date: "4 مارس 2026", tag: "نيوم" },
  { title: "السعودية تستثمر $147B في البنية التحتية للنقل", date: "2 مارس 2026", tag: "استثمار" },
  { title: "الإمارات تدشّن خط Hyperloop تجريبي أبوظبي-دبي", date: "28 فبراير 2026", tag: "ابتكار" },
];

export default function TabTransport() {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Maritime Corridors */}
      <div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>🚢 الممرات البحرية الاستراتيجية</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
          {CORRIDORS.map(c => (
            <div key={c.name} style={{ background: "#0a1628", border: `1px solid ${c.riskColor}33`, borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{c.name}</span>
                <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 3, background: c.riskColor + "22", color: c.riskColor }}>{c.risk}</span>
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>حركة المرور: {c.traffic}</div>
              <div style={{ fontSize: 10, color: c.status === "مفتوح" ? "#22c55e" : "#ef4444", marginTop: 4 }}>الحالة: {c.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ports */}
      <div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>⚓ الموانئ الرئيسية</div>
        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 80px 80px 60px", padding: "8px 14px", background: "#080f1c", borderBottom: "1px solid #1e293b", fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>
            <span>الميناء</span><span style={{ textAlign: "center" }}>الدولة</span><span style={{ textAlign: "center" }}>الترتيب</span><span style={{ textAlign: "center" }}>السعة</span><span style={{ textAlign: "center" }}>النمو</span>
          </div>
          {PORTS.map(p => (
            <div key={p.name} style={{ display: "grid", gridTemplateColumns: "1fr 40px 80px 80px 60px", padding: "10px 14px", borderBottom: "1px solid #0f1829", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{p.name}</span>
              <span style={{ textAlign: "center" }}>{p.country}</span>
              <span style={{ fontSize: 10, color: "#6366f1", textAlign: "center" }}>{p.rank}</span>
              <span style={{ fontSize: 10, color: "#94a3b8", textAlign: "center" }}>{p.teu}</span>
              <span style={{ fontSize: 10, color: "#22c55e", textAlign: "center", fontWeight: 700 }}>{p.growth}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Airports */}
      <div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>✈️ المطارات الكبرى</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
          {AIRPORTS.map(a => (
            <div key={a.code} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{a.name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", background: "#6366f122", padding: "1px 6px", borderRadius: 3 }}>{a.code}</span>
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>مسافرون: {a.pax}</div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>شحن: {a.cargo}</div>
              <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 4 }}>{a.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live News Feed */}
      <LiveNewsFeed
        category="economic"
        title="📰 أخبار النقل واللوجستيات"
        limit={5}
        fallbackNews={LOGISTICS_NEWS}
      />
    </div>
  );
}
