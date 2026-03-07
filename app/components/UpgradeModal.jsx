"use client";

export default function UpgradeModal({ onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: "rtl",
    }}>
      <div style={{
        background: "#0a1628", border: "1px solid #22c55e44",
        borderRadius: 16, padding: "32px 28px", maxWidth: 420, width: "90%",
        textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc", marginBottom: 8 }}>
          وصلت للحد اليومي
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8, marginBottom: 24 }}>
          استخدمت 3 تحليلات AI اليوم.
          <br />
          ترقّ للخطة المدفوعة للحصول على تحليلات غير محدودة + غرفة عمليات كاملة + تنبيهات فورية.
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <a href="/login" style={{
            padding: "10px 24px", borderRadius: 8,
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "#fff", fontSize: 13, fontWeight: 700,
            textDecoration: "none", border: "none", cursor: "pointer",
          }}>
            ⚡ ترقية الآن
          </a>
          <button onClick={onClose} style={{
            padding: "10px 24px", borderRadius: 8,
            background: "transparent", border: "1px solid #1e293b",
            color: "#64748b", fontSize: 13, cursor: "pointer",
            fontFamily: "inherit",
          }}>
            إغلاق
          </button>
        </div>

        <div style={{ fontSize: 10, color: "#334155", marginTop: 16 }}>
          الخطة المدفوعة تبدأ من $49/شهر
        </div>
      </div>
    </div>
  );
}
