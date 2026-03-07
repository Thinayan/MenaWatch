"use client";
import LiveNewsFeed from "../LiveNewsFeed";

const OPERATORS = [
  { name: "STC (stc)", country: "🇸🇦", subs: "142M", revenue: "$16.8B", g5: "98%", stock: "43.70", chg: "+0.8%" },
  { name: "Etisalat (e&)", country: "🇦🇪", subs: "163M", revenue: "$14.2B", g5: "99%", stock: "—", chg: "—" },
  { name: "Zain Group", country: "🇰🇼", subs: "52M", revenue: "$5.6B", g5: "85%", stock: "—", chg: "—" },
  { name: "Ooredoo", country: "🇶🇦", subs: "68M", revenue: "$7.8B", g5: "95%", stock: "—", chg: "—" },
  { name: "Mobily", country: "🇸🇦", subs: "21M", revenue: "$4.2B", g5: "90%", stock: "57.20", chg: "+1.2%" },
];

const INFRA = [
  { name: "كابل 2Africa", type: "بحري", length: "45,000 km", status: "تشغيل 2024", color: "#0ea5e9" },
  { name: "كابل PEACE", type: "بحري", length: "15,000 km", status: "نشط", color: "#22c55e" },
  { name: "كابل Blue-Raman", type: "بحري", length: "5,600 km", status: "تشغيل 2025", color: "#f59e0b" },
  { name: "مركز بيانات AWS الرياض", type: "مركز بيانات", length: "—", status: "نشط 2024", color: "#8b5cf6" },
  { name: "Oracle Cloud جدة", type: "مركز بيانات", length: "—", status: "نشط", color: "#ef4444" },
];

const DIGITAL_STATS = [
  { label: "انتشار الإنترنت", val: "99%", icon: "🌐", color: "#0ea5e9" },
  { label: "تغطية 5G", val: "95%+", icon: "📡", color: "#22c55e" },
  { label: "مراكز البيانات", val: "45+", icon: "🏢", color: "#f59e0b" },
  { label: "الاستثمار الرقمي", val: "$28B", icon: "💰", color: "#8b5cf6" },
];

export default function TabTelecom() {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {DIGITAL_STATS.map(s => (
          <div key={s.label} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 9, color: "#94a3b8" }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>📶 شركات الاتصالات الكبرى</div>
        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 60px 70px 50px", padding: "8px 14px", background: "#080f1c", borderBottom: "1px solid #1e293b", fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>
            <span>الشركة</span><span style={{ textAlign: "center" }}>الدولة</span><span style={{ textAlign: "center" }}>المشتركين</span><span style={{ textAlign: "center" }}>الإيرادات</span><span style={{ textAlign: "center" }}>5G</span>
          </div>
          {OPERATORS.map(o => (
            <div key={o.name} style={{ display: "grid", gridTemplateColumns: "1fr 40px 60px 70px 50px", padding: "10px 14px", borderBottom: "1px solid #0f1829", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{o.name}</span>
              <span style={{ textAlign: "center" }}>{o.country}</span>
              <span style={{ fontSize: 10, color: "#0ea5e9", textAlign: "center" }}>{o.subs}</span>
              <span style={{ fontSize: 10, color: "#94a3b8", textAlign: "center" }}>{o.revenue}</span>
              <span style={{ fontSize: 10, color: "#22c55e", textAlign: "center", fontWeight: 700 }}>{o.g5}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>🔌 البنية التحتية الرقمية</div>
        {INFRA.map(inf => (
          <div key={inf.name} style={{ background: "#0a1628", border: `1px solid ${inf.color}33`, borderRadius: 6, padding: "10px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{inf.name}</div>
              <div style={{ fontSize: 9, color: "#94a3b8" }}>{inf.type} {inf.length !== "—" ? `| ${inf.length}` : ""}</div>
            </div>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 3, background: inf.color + "22", color: inf.color }}>{inf.status}</span>
          </div>
        ))}
      </div>

      {/* Live Tech News */}
      <LiveNewsFeed
        category="tech"
        title="📰 آخر أخبار التقنية والاتصالات"
        limit={5}
      />
    </div>
  );
}
