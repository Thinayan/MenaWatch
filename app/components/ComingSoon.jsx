"use client";
import { useState, useEffect } from "react";

const FONT_URL = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap";

function useCountdown(target) {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setLeft({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

const FEATURES_COMING = [
  { icon: "🛡️", label: "خريطة أمنية تفاعلية",   status: "جاهز 100%",  color: "#22c55e", done: true },
  { icon: "⚡", label: "لوحة اقتصادية حية",       status: "جاهز 100%",  color: "#22c55e", done: true },
  { icon: "🤖", label: "تحليل Claude AI",          status: "جاهز 100%",  color: "#22c55e", done: true },
  { icon: "📡", label: "تنبيهات فورية",            status: "قريباً",     color: "#f59e0b", done: false },
  { icon: "📊", label: "تقارير PDF تلقائية",       status: "قريباً",     color: "#f59e0b", done: false },
  { icon: "🔗", label: "API للمطورين",             status: "قريباً",     color: "#3b82f6", done: false },
];

export default function ComingSoon() {
  const [email, setEmail]   = useState("");
  const [done, setDone]     = useState(false);
  const [count, setCount]   = useState(2347);
  const t = useCountdown("2025-09-01T00:00:00");

  return (
    <div className="coming-root" style={{
      direction: "rtl",
      minHeight: "100vh",
      background: "#060d18",
      color: "#e2e8f0",
      fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        @import url('${FONT_URL}');
        .coming-root, .coming-root * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e293b; }
        @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scan { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
      `}</style>

      {/* Scan line effect */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: 2, background: "linear-gradient(90deg, transparent, #22c55e22, transparent)", animation: "scan 4s linear infinite", pointerEvents: "none", zIndex: 1 }} />

      {/* TOP BAR */}
      <div style={{
        background: "linear-gradient(90deg, #0a1628 0%, #0f1f3d 50%, #0a1628 100%)",
        borderBottom: "1px solid #1e293b",
        padding: "0 20px",
        display: "flex", alignItems: "center", gap: 10,
        height: 44,
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo-sm.png" alt="MENA.Watch" style={{ height: 30, width: "auto" }} />
        </a>
        <div style={{ flex: 1 }} />
        <a href="/free" style={{ padding: "4px 10px", borderRadius: 3, background: "#22c55e18", border: "1px solid #22c55e33", color: "#22c55e", fontSize: 10, fontWeight: 700, textDecoration: "none" }}>جرب النسخة التجريبية</a>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", padding: "40px 20px", gap: 24, maxWidth: 1000, margin: "0 auto", width: "100%" }}>

        {/* LEFT — Info */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", animation: "fadeIn 0.5s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#22c55e12", border: "1px solid #22c55e33", borderRadius: 3, padding: "4px 10px", fontSize: 9, color: "#22c55e", fontWeight: 700, letterSpacing: 1, marginBottom: 20, width: "fit-content" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 1s infinite" }} />
            قيد التطوير النهائي
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#f8fafc", lineHeight: 1.2, marginBottom: 12 }}>
            الإطلاق الرسمي<br />
            <span style={{ color: "#22c55e" }}>قريباً</span>
          </h1>

          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 28, maxWidth: 400 }}>
            منصة MENA Watch تستعد للإطلاق الكامل. سجّل الآن للحصول على وصول مبكر وتقرير تجريبي مجاني.
          </p>

          {/* Email form */}
          {!done ? (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input type="email" placeholder="بريدك الإلكتروني" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1, padding: "9px 12px", borderRadius: 4, border: "1px solid #1e293b", background: "#0a0f1e", color: "#e2e8f0", fontSize: 12, textAlign: "right", outline: "none", fontFamily: "inherit" }} />
                <button onClick={() => { setDone(true); setCount(c => c + 1); }}
                  style={{ padding: "9px 18px", borderRadius: 4, background: "#22c55e", color: "#000", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                  أبلغني
                </button>
              </div>
              <div style={{ fontSize: 10, color: "#334155" }}>انضم لـ {count.toLocaleString("ar-SA")} في قائمة الانتظار</div>
            </div>
          ) : (
            <div style={{ background: "#064e3b", border: "1px solid #22c55e44", borderRadius: 4, padding: "10px 16px", color: "#6ee7b7", fontSize: 12, fontWeight: 700 }}>
              ✅ تم التسجيل! ستصلك رسالة عند الإطلاق
            </div>
          )}

          {/* Progress */}
          <div style={{ marginTop: 32, background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#475569" }}>تقدم التطوير الكلي</span>
              <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>٨٧%</span>
            </div>
            <div style={{ height: 5, background: "#1e293b", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ height: "100%", width: "87%", background: "#22c55e", borderRadius: 2 }} />
            </div>
            {FEATURES_COMING.map(f => (
              <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12 }}>{f.icon}</span>
                <span style={{ flex: 1, fontSize: 11, color: "#94a3b8" }}>{f.label}</span>
                <span style={{ fontSize: 9, color: f.color, background: f.color + "18", padding: "2px 7px", borderRadius: 2, fontWeight: 700 }}>{f.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Countdown */}
        <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>

          {/* Countdown card */}
          <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ background: "#080f1c", borderBottom: "1px solid #1e293b", padding: "8px 14px", fontSize: 10, color: "#475569", letterSpacing: 2 }}>العد التنازلي للإطلاق</div>
            <div style={{ padding: "20px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[{ v: t.d, l: "يوم" }, { v: t.h, l: "ساعة" }, { v: t.m, l: "دقيقة" }, { v: t.s, l: "ثانية" }].map(c => (
                <div key={c.l} style={{ background: "#080f1c", border: "1px solid #1e293b", borderRadius: 4, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#22c55e", fontVariantNumeric: "tabular-nums" }}>
                    {String(c.v).padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>{c.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, padding: "16px 14px" }}>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: 2, marginBottom: 12 }}>قائمة الانتظار</div>
            {[
              { flag: "🇸🇦", label: "السعودية", n: "٨٤٣" },
              { flag: "🇦🇪", label: "الإمارات", n: "٤٢١" },
              { flag: "🇶🇦", label: "قطر",      n: "٣١٢" },
              { flag: "🌍", label: "دول أخرى", n: "٧٧١" },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>{r.flag}</span>
                <span style={{ flex: 1, fontSize: 11, color: "#94a3b8" }}>{r.label}</span>
                <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>{r.n}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #1e293b", paddingTop: 8, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: "#475569" }}>المجموع</span>
              <span style={{ fontSize: 11, color: "#f8fafc", fontWeight: 700 }}>{count.toLocaleString("ar-SA")}</span>
            </div>
          </div>

          {/* Preview link */}
          <a href="/free" style={{ display: "block", textAlign: "center", padding: "9px 0", borderRadius: 4, background: "#22c55e18", border: "1px solid #22c55e33", color: "#22c55e", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
            ← جرب النسخة التجريبية الآن
          </a>
        </div>
      </div>
    </div>
  );
}
