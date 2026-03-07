"use client";
import LiveNewsFeed from "../LiveNewsFeed";

const HEALTH_CITIES = [
  { name: "مدينة الملك فهد الطبية", city: "الرياض", beds: 1200, specialty: "شامل", status: "تشغيل كامل" },
  { name: "مستشفى الملك فيصل التخصصي", city: "الرياض", beds: 894, specialty: "أورام / زراعة", status: "تشغيل كامل" },
  { name: "مدينة الملك عبدالله الطبية", city: "مكة", beds: 1500, specialty: "شامل", status: "تشغيل كامل" },
  { name: "مستشفى كليفلاند كلينك", city: "أبوظبي", beds: 364, specialty: "متعدد", status: "تشغيل كامل" },
  { name: "مستشفى بمرونجراد", city: "بانكوك (سياحة علاجية)", beds: 580, specialty: "متعدد", status: "شراكة" },
];

const HEALTH_INITIATIVES = [
  { name: "نظام صحي - السعودية", budget: "$65B", target: "تحول رقمي صحي شامل بحلول 2030", progress: 45, color: "#10b981" },
  { name: "DHA - دبي", budget: "$12B", target: "سياحة علاجية 500K زائر/سنة", progress: 68, color: "#3b82f6" },
  { name: "SEHA - أبوظبي", budget: "$8B", target: "تغطية صحية شاملة", progress: 72, color: "#f59e0b" },
];

const HEALTH_NEWS = [
  { title: "السعودية تطلق برنامج الجينوم البشري بتكلفة $1.6B", date: "5 مارس 2026", tag: "جينوم" },
  { title: "الإمارات تعتمد الذكاء الاصطناعي في تشخيص 12 مرض", date: "3 مارس 2026", tag: "AI" },
  { title: "قطر تفتتح أكبر مركز أبحاث طبية في الخليج", date: "1 مارس 2026", tag: "أبحاث" },
];

export default function TabHealth() {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {[
          { label: "مستشفيات MENA", val: "4,200+", icon: "🏥", color: "#10b981" },
          { label: "أسرّة / 1000", val: "2.1", icon: "🛏️", color: "#3b82f6" },
          { label: "إنفاق صحي", val: "$180B", icon: "💰", color: "#f59e0b" },
          { label: "سياحة علاجية", val: "3.2M", icon: "✈️", color: "#8b5cf6" },
        ].map(s => (
          <div key={s.label} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 9, color: "#475569" }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Medical Cities */}
      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>🏥 أبرز المنشآت الصحية</div>
        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 60px 100px 80px", padding: "8px 14px", background: "#080f1c", borderBottom: "1px solid #1e293b", fontSize: 10, color: "#475569", fontWeight: 600 }}>
            <span>المنشأة</span><span style={{ textAlign: "center" }}>المدينة</span><span style={{ textAlign: "center" }}>الأسرّة</span><span style={{ textAlign: "center" }}>التخصص</span><span style={{ textAlign: "center" }}>الحالة</span>
          </div>
          {HEALTH_CITIES.map(h => (
            <div key={h.name} style={{ display: "grid", gridTemplateColumns: "1fr 80px 60px 100px 80px", padding: "10px 14px", borderBottom: "1px solid #0f1829", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{h.name}</span>
              <span style={{ fontSize: 10, color: "#94a3b8", textAlign: "center" }}>{h.city}</span>
              <span style={{ fontSize: 11, color: "#10b981", textAlign: "center", fontWeight: 700 }}>{h.beds}</span>
              <span style={{ fontSize: 10, color: "#64748b", textAlign: "center" }}>{h.specialty}</span>
              <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "#14532d", color: "#22c55e", textAlign: "center" }}>{h.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Initiatives */}
      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>📊 مبادرات التحول الصحي</div>
        {HEALTH_INITIATIVES.map(i => (
          <div key={i.name} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, padding: "10px 14px", marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{i.name}</span>
              <span style={{ fontSize: 10, color: "#475569" }}>الميزانية: {i.budget}</span>
            </div>
            <div style={{ fontSize: 10, color: "#64748b", marginBottom: 6 }}>{i.target}</div>
            <div style={{ background: "#1e293b", borderRadius: 3, height: 4, overflow: "hidden" }}>
              <div style={{ width: i.progress + "%", height: "100%", background: i.color, borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 9, color: i.color, marginTop: 2 }}>{i.progress}%</div>
          </div>
        ))}
      </div>

      {/* Live News Feed */}
      <LiveNewsFeed
        category="health"
        title="📰 آخر الأخبار الصحية"
        limit={5}
        fallbackNews={HEALTH_NEWS}
      />
    </div>
  );
}
