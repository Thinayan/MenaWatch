"use client";
import { useState, useEffect } from "react";

const CONSULTING_FIRMS = [
  { key: "all", name: "الكل", nameAr: "جميع الشركات", color: "#94a3b8", icon: "📑" },
  { key: "mckinsey", name: "McKinsey & Company", nameAr: "ماكنزي", color: "#003d6b", icon: "🔷" },
  { key: "bcg", name: "Boston Consulting Group", nameAr: "بوسطن كونسلتينج", color: "#00a86b", icon: "🟢" },
  { key: "pwc", name: "PwC", nameAr: "برايس ووتر هاوس", color: "#d04a02", icon: "🟠" },
  { key: "kpmg", name: "KPMG", nameAr: "كي بي إم جي", color: "#00338d", icon: "🔵" },
  { key: "strategyand", name: "Strategy&", nameAr: "ستراتيجي آند", color: "#c23b22", icon: "🔴" },
  { key: "deloitte", name: "Deloitte", nameAr: "ديلويت", color: "#86bc25", icon: "🟩" },
  { key: "ey", name: "Ernst & Young", nameAr: "إرنست آند يونغ", color: "#ffe600", icon: "🟡" },
];

const CATEGORY_LABELS = {
  economic: { label: "اقتصادي", color: "#f59e0b" },
  tech: { label: "تقنية", color: "#8b5cf6" },
  energy: { label: "طاقة", color: "#22c55e" },
  political: { label: "سياسي", color: "#ef4444" },
  security: { label: "أمني", color: "#3b82f6" },
  health: { label: "صحي", color: "#10b981" },
  general: { label: "عام", color: "#94a3b8" },
};

const SAMPLE_REPORTS = [
  { firm: "mckinsey", title: "مستقبل الطاقة في السعودية 2030 — تحول النظام الطاقي", category: "energy", date: "2025-12", link: "https://www.mckinsey.com/industries/oil-and-gas/our-insights" },
  { firm: "mckinsey", title: "التحول الرقمي في دول الخليج — الفرص والتحديات", category: "tech", date: "2025-09", link: "https://www.mckinsey.com/mgi/our-research" },
  { firm: "mckinsey", title: "مستقبل العمل في الشرق الأوسط بعد الذكاء الاصطناعي", category: "economic", date: "2026-01", link: "https://www.mckinsey.com/mgi/our-research" },
  { firm: "bcg", title: "الاستثمار في البنية التحتية — رؤية الشرق الأوسط", category: "economic", date: "2025-11", link: "https://www.bcg.com/publications" },
  { firm: "bcg", title: "صناعة السياحة في السعودية — خارطة طريق 2030", category: "economic", date: "2025-08", link: "https://www.bcg.com/publications" },
  { firm: "bcg", title: "الأمن الغذائي في دول مجلس التعاون الخليجي", category: "economic", date: "2026-02", link: "https://www.bcg.com/publications" },
  { firm: "pwc", title: "رؤية الشرق الأوسط الاقتصادية 2026", category: "economic", date: "2026-01", link: "https://www.pwc.com/m1/en/publications.html" },
  { firm: "pwc", title: "تقرير أسواق رأس المال — الخليج العربي", category: "economic", date: "2025-10", link: "https://www.pwc.com/m1/en/publications.html" },
  { firm: "pwc", title: "التقنية المالية وابتكارات الدفع — MENA", category: "tech", date: "2025-06", link: "https://www.pwc.com/m1/en/publications.html" },
  { firm: "kpmg", title: "القطاع المصرفي السعودي — نظرة مستقبلية 2026", category: "economic", date: "2025-12", link: "https://kpmg.com/sa/en/home/insights.html" },
  { firm: "kpmg", title: "التقنية المالية في منطقة MENA — فرص النمو", category: "tech", date: "2025-07", link: "https://kpmg.com/sa/en/home/insights.html" },
  { firm: "kpmg", title: "ESG والاستدامة في القطاع الخاص السعودي", category: "economic", date: "2026-01", link: "https://kpmg.com/sa/en/home/insights.html" },
  { firm: "strategyand", title: "إعادة تشكيل اقتصادات الخليج — ما بعد النفط", category: "economic", date: "2025-11", link: "https://www.strategyand.pwc.com/m1/en.html" },
  { firm: "strategyand", title: "مستقبل قطاع الطاقة المتجددة في MENA", category: "energy", date: "2025-06", link: "https://www.strategyand.pwc.com/m1/en.html" },
  { firm: "strategyand", title: "تقرير رأس المال البشري — الخليج 2026", category: "economic", date: "2026-02", link: "https://www.strategyand.pwc.com/m1/en.html" },
  { firm: "deloitte", title: "تقرير قطاع التجزئة في دول الخليج 2026", category: "economic", date: "2025-10", link: "https://www2.deloitte.com/xe/en.html" },
  { firm: "deloitte", title: "الذكاء الاصطناعي في القطاع الحكومي — السعودية", category: "tech", date: "2025-09", link: "https://www2.deloitte.com/xe/en.html" },
  { firm: "deloitte", title: "تقرير المخاطر الجيوسياسية — الشرق الأوسط 2026", category: "security", date: "2026-01", link: "https://www2.deloitte.com/xe/en.html" },
  { firm: "ey", title: "جاذبية الاستثمار في الشرق الأوسط 2025", category: "economic", date: "2025-05", link: "https://www.ey.com/en_ae/attractiveness" },
  { firm: "ey", title: "IPOs في منطقة الخليج — التقرير السنوي 2025", category: "economic", date: "2025-12", link: "https://www.ey.com/en_ae/ipo" },
  { firm: "ey", title: "قطاع الرعاية الصحية في السعودية — رؤية 2030", category: "health", date: "2026-02", link: "https://www.ey.com/en_ae/health" },
];

// Source keys that match consulting firms in content-sync
const CONSULTING_SOURCE_KEYS = [
  "mckinsey_me", "bcg_me", "pwc_me", "kpmg_me", "strategyand_me", "deloitte_me", "ey_me"
];

export default function ConsultingReports() {
  const [selectedFirm, setSelectedFirm] = useState("all");
  const [liveArticles, setLiveArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch live articles from consulting sources
  useEffect(() => {
    let cancelled = false;
    async function fetchLive() {
      try {
        const res = await fetch(`/api/articles?limit=30&source_keys=${CONSULTING_SOURCE_KEYS.join(",")}`);
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        if (!cancelled && data.articles?.length > 0) {
          setLiveArticles(data.articles);
        }
      } catch {}
      if (!cancelled) setLoading(false);
    }
    fetchLive();
    return () => { cancelled = true; };
  }, []);

  // Filter reports by firm
  const filteredReports = selectedFirm === "all"
    ? SAMPLE_REPORTS
    : SAMPLE_REPORTS.filter(r => r.firm === selectedFirm);

  // Map live articles to firm keys
  const liveMapped = liveArticles.map(a => {
    const firmKey = CONSULTING_SOURCE_KEYS.find(sk => a.source_key === sk);
    return { ...a, firmKey: firmKey?.replace("_me", "") || "general" };
  });

  const filteredLive = selectedFirm === "all"
    ? liveMapped
    : liveMapped.filter(a => a.firmKey === selectedFirm);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Firm Selector */}
      <div style={{
        display: "flex",
        gap: 6,
        overflowX: "auto",
        paddingBottom: 6,
        scrollbarWidth: "none",
      }}>
        {CONSULTING_FIRMS.map(firm => {
          const isActive = selectedFirm === firm.key;
          return (
            <button
              key={firm.key}
              onClick={() => setSelectedFirm(firm.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid",
                borderColor: isActive ? firm.color : "#1e293b",
                background: isActive ? `${firm.color}15` : "transparent",
                color: isActive ? firm.color : "#94a3b8",
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 14 }}>{firm.icon}</span>
              {firm.nameAr}
            </button>
          );
        })}
      </div>

      {/* Stats Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {[
          { label: "شركات استشارية", val: "7", icon: "🏢", color: "#3b82f6" },
          { label: "تقارير متاحة", val: `${SAMPLE_REPORTS.length}+`, icon: "📑", color: "#22c55e" },
          { label: "فئات مغطاة", val: "6", icon: "📂", color: "#f59e0b" },
          { label: "تقارير حية", val: liveArticles.length > 0 ? String(liveArticles.length) : "—", icon: "📡", color: "#8b5cf6" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8,
            padding: "12px 14px", textAlign: "center",
          }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
            <div style={{ fontSize: 9, color: "#94a3b8" }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Live Articles from Consulting Firms */}
      {filteredLive.length > 0 && (
        <div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span>📡</span>
            <span style={{ fontWeight: 600 }}>تقارير حية</span>
            <span style={{
              fontSize: 9, padding: "1px 6px", borderRadius: 3,
              background: "#22c55e22", color: "#22c55e", fontWeight: 600,
            }}>مباشر</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {filteredLive.slice(0, 10).map((a, i) => (
              <a
                key={a.id || i}
                href={a.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  background: "#0a1628",
                  border: "1px solid #1e293b",
                  borderRadius: 6,
                  padding: "10px 14px",
                  textDecoration: "none",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#334155")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e293b")}
              >
                <div style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.5, marginBottom: 4 }}>{a.title}</div>
                <div style={{ display: "flex", gap: 8, fontSize: 9, color: "#94a3b8" }}>
                  <span style={{ color: "#22c55e" }}>{a.source_name}</span>
                  <span>{a.category}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Sample Reports Grid */}
      <div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <span>📑</span>
          <span style={{ fontWeight: 600 }}>تقارير وأبحاث بارزة عن الشرق الأوسط</span>
          <span style={{ fontSize: 9, color: "#64748b" }}>({filteredReports.length} تقرير)</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
          {filteredReports.map((report, i) => {
            const firm = CONSULTING_FIRMS.find(f => f.key === report.firm);
            const cat = CATEGORY_LABELS[report.category] || CATEGORY_LABELS.general;
            return (
              <a
                key={i}
                href={report.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#0a1628",
                  border: `1px solid ${firm?.color || "#1e293b"}22`,
                  borderRadius: 8,
                  padding: "14px 16px",
                  textDecoration: "none",
                  transition: "border-color 0.2s, transform 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = firm?.color || "#334155";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${firm?.color || "#1e293b"}22`;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Firm + Category */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{firm?.icon}</span>
                    <span style={{ fontSize: 10, color: firm?.color, fontWeight: 700 }}>{firm?.nameAr}</span>
                  </div>
                  <span style={{
                    fontSize: 9, padding: "2px 8px", borderRadius: 3,
                    background: `${cat.color}22`, color: cat.color, fontWeight: 600,
                  }}>
                    {cat.label}
                  </span>
                </div>

                {/* Title */}
                <div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600, lineHeight: 1.5 }}>
                  {report.title}
                </div>

                {/* Date */}
                <div style={{ fontSize: 9, color: "#64748b" }}>
                  📅 {report.date}
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        background: "#080f1c",
        border: "1px solid #1e293b",
        borderRadius: 8,
        padding: "12px 16px",
        fontSize: 10,
        color: "#64748b",
        textAlign: "center",
        lineHeight: 1.6,
      }}>
        التقارير متاحة من المصادر المجانية للشركات الاستشارية. للتقارير الكاملة يُرجى زيارة مواقع الشركات مباشرة.
      </div>
    </div>
  );
}
