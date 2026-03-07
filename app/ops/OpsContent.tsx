"use client";
import { useEffect, useState, lazy, Suspense } from "react";
import { supabase } from "../../lib/supabase";
import InteractiveMap from "../components/InteractiveMap";

const MediaSourcesAdmin = lazy(() => import("../components/MediaSourcesAdmin"));

export default function OpsContent() {
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState("map");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => setUser(data.user));
  }, []);

  const TABS = [
    { id: "map", label: "خريطة المخاطر", icon: "🌍" },
    { id: "alerts", label: "التنبيهات", icon: "🔔" },
    { id: "reports", label: "التقارير", icon: "📊" },
    { id: "media", label: "إدارة المصادر", icon: "📺" },
    { id: "settings", label: "الإعدادات", icon: "⚙️" },
  ];

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", background: "#060d18", minHeight: "100vh", color: "#e2e8f0", direction: "rtl", display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap');*{box-sizing:border-box}`}</style>
      {/* Header */}
      <div style={{ background: "#0a1628", borderBottom: "1px solid #1e293b", padding: "0 24px", height: 52, display: "flex", alignItems: "center", gap: 14 }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <img src="/logo-sm.png" alt="MENA.Watch" style={{ height: 30, width: "auto" }} />
        </a>
        <span style={{ color: "#1e293b" }}>|</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#f59e0b" }}>🔐 لوحة العمليات</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: "#22c55e" }}>👤 {user?.email?.split("@")[0] || "..."}</span>
        <button onClick={() => (supabase.auth as any).signOut().then(() => window.location.href="/")}
          style={{ background: "#7f1d1d", border: "none", borderRadius: 6, padding: "6px 12px", color: "#ef4444", fontFamily: "inherit", fontSize: 11, cursor: "pointer" }}>
          تسجيل الخروج
        </button>
      </div>

      {/* Sub-nav */}
      <div style={{ background: "#080f1c", borderBottom: "1px solid #1e293b", padding: "0 24px", display: "flex", gap: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 16px", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
            background: "transparent", border: "none", cursor: "pointer",
            color: tab===t.id?"#f59e0b":"#64748b",
            borderBottom: `2px solid ${tab===t.id?"#f59e0b":"transparent"}`,
            display: "flex", alignItems: "center", gap: 6,
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {tab === "map" && <div style={{ height: "calc(100vh - 104px)" }}><InteractiveMap /></div>}
        {tab === "alerts" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", marginBottom: 16 }}>التنبيهات النشطة</div>
            <div style={{ background: "#0a1628", border: "1px solid #ef444433", borderRadius: 10, padding: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontSize: 24 }}>🔴</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 4 }}>اليمن — مستوى 2 (عالي الخطر)</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>47 حدث خلال آخر 24 ساعة — ارتفاع 12% عن المتوسط</div>
              </div>
            </div>
          </div>
        )}
        {tab === "reports" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", marginBottom: 16 }}>التقارير اليومية</div>
            <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 12, color: "#64748b" }}>قريباً — تقارير ذكاء اصطناعي شاملة</div>
            </div>
          </div>
        )}
        {tab === "media" && (
          <div style={{ flex: 1, overflow: "auto" }}>
            <Suspense fallback={<div style={{ padding: 24, color: "#64748b" }}>جارٍ التحميل...</div>}>
              <MediaSourcesAdmin />
            </Suspense>
          </div>
        )}
        {tab === "settings" && (
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", marginBottom: 16 }}>الإعدادات</div>
            <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 12, color: "#64748b" }}>قريباً — إعدادات متقدمة</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
