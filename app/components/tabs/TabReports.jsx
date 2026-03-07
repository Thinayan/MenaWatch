"use client";
import { useState, useEffect } from "react";
import LiveNewsFeed from "../LiveNewsFeed";

const SAMPLE_REPORTS = [
  { id: 1, date: "6 مارس 2026", title: "التقرير اليومي — الخميس", summary: "أرامكو تتجاوز التوقعات • هدنة يمنية • تاسي صعود ثالث", status: "جديد" },
  { id: 2, date: "5 مارس 2026", title: "التقرير اليومي — الأربعاء", summary: "أوبك+ تثبت الإنتاج • مفاوضات جنيف • برنت مستقر", status: "منشور" },
  { id: 3, date: "4 مارس 2026", title: "التقرير اليومي — الثلاثاء", summary: "الجينوم السعودي • توسعة المطارات • الذهب يصعد", status: "منشور" },
  { id: 4, date: "3 مارس 2026", title: "التقرير اليومي — الاثنين", summary: "AI تشخيص الإمارات • ميزانية الدفاع • النفط هابط", status: "منشور" },
  { id: 5, date: "2 مارس 2026", title: "التقرير اليومي — الأحد", summary: "قمة GCC الاقتصادية • صفقات تقنية • الريال مستقر", status: "منشور" },
];

export default function TabReports() {
  const [reports, setReports] = useState(SAMPLE_REPORTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/reports").then(r => r.json()).then(d => {
      if (d.reports && d.reports.length > 0) {
        setReports(d.reports.map((r, i) => ({
          id: r.id || i,
          date: r.date || "—",
          title: `التقرير اليومي — ${r.date}`,
          summary: r.content?.substring(0, 80) || "—",
          status: "منشور",
        })));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDownloadPDF = (reportDate) => {
    fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportDate }),
    })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `MENA-Watch-${reportDate}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => alert("تعذّر تحميل التقرير"));
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {[
          { label: "تقارير هذا الشهر", val: reports.length, color: "#14b8a6" },
          { label: "إجمالي التقارير", val: "365+", color: "#3b82f6" },
          { label: "PDF متاحة", val: "✓", color: "#22c55e" },
        ].map(s => (
          <div key={s.label} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#94a3b8" }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>📋 آخر التقارير اليومية</div>
        {loading ? (
          <div style={{ padding: 24, textAlign: "center", color: "#14b8a6" }}>جارٍ التحميل...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {reports.map(r => (
              <div key={r.id} style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{r.title}</span>
                    {r.status === "جديد" && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: "#14b8a622", color: "#14b8a6", marginRight: 6 }}>جديد</span>}
                  </div>
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>{r.date}</span>
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 8 }}>{r.summary}</div>
                <button onClick={() => handleDownloadPDF(r.date)} style={{ background: "#14b8a622", border: "1px solid #14b8a644", borderRadius: 4, padding: "4px 12px", color: "#14b8a6", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  📥 تحميل PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <LiveNewsFeed
        category="political"
        title="📰 آخر الأخبار السياسية"
        limit={5}
      />
    </div>
  );
}
