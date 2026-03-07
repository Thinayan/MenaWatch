"use client";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";

// ── نفس الـ Logo Base64 الموجود في OpsRoom ─────────────────────────────────
// يُستورد من الصفحات الأخرى — هنا نستخدم النص المباشر

const FONT_URL = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap";

const STATS = [
  { n: "١٢٠+",   l: "دولة تحت المراقبة",      trend: "↑" },
  { n: "٥٠٠+",   l: "مصدر إخباري مرتبط",       trend: "↑" },
  { n: "٩٨%",    l: "دقة التنبؤات",            trend: "↑" },
  { n: "٢٤/٧",   l: "رصد متواصل بلا انقطاع",  trend: "→" },
];

const FEATURES = [
  { icon: "🛡️", title: "خريطة أمنية تفاعلية",     color: "#ef4444", desc: "تصور حي لمناطق التوتر والنزاعات مع مؤشرات DEFCON إقليمية" },
  { icon: "⚡", title: "تحليل اقتصادي فوري",       color: "#f59e0b", desc: "أسواق الخليج، النفط، الممرات التجارية — في لوحة واحدة" },
  { icon: "🌐", title: "رصد البنية الرقمية",        color: "#3b82f6", desc: "كابلات بحرية، مراكز بيانات، شبكات اتصالات المنطقة" },
  { icon: "🚀", title: "فرص الاستثمار والمشاريع",   color: "#22c55e", desc: "مشاريع رؤية 2030 والصفقات الكبرى في الشرق الأوسط" },
  { icon: "🤖", title: "تحليل Claude AI",           color: "#8b5cf6", desc: "تحليل استراتيجي فوري لأي منطقة أو حدث بالذكاء الاصطناعي" },
  { icon: "📡", title: "غرفة عمليات متكاملة",       color: "#22c55e", desc: "تتبع الأحداث والتنبؤات الاستراتيجية في الوقت الحقيقي" },
];

const PLANS = [
  {
    name: "مجاني", price: "$0", period: "دائماً",
    accent: "#64748b", border: "#1e293b", bg: "#0a1628",
    features: ["الخريطة الأساسية", "٥ تحليلات AI / شهر", "الأخبار الإقليمية", "بث مباشر محدود"],
    cta: "ابدأ مجاناً", ctaBg: "#1e293b", ctaColor: "#94a3b8",
  },
  {
    name: "خبير", price: "$49", period: "/شهر",
    accent: "#22c55e", border: "#22c55e44", bg: "#0a1628",
    badge: "الأكثر طلباً",
    features: ["كل المميزات المجانية", "تحليلات Claude AI غير محدودة", "غرفة عمليات كاملة", "تنبيهات فورية", "تقارير يومية صباحية"],
    cta: "ابدأ تجربة مجانية", ctaBg: "#22c55e", ctaColor: "#000",
  },
  {
    name: "مؤسسي", price: "$299", period: "/شهر",
    accent: "#f59e0b", border: "#f59e0b44", bg: "#0a1628",
    features: ["كل مميزات الخبير", "API للبيانات", "لوحات مخصصة", "٥ مستخدمين", "دعم مباشر ٢٤/٧"],
    cta: "تواصل معنا", ctaBg: "#f59e0b22", ctaColor: "#f59e0b",
  },
];

const NEWS_TICKER = [
  "مجلس الأمن يعقد جلسة طارئة حول البحر الأحمر",
  "HUMAIN تعلن شراكة مع NVIDIA لمجمع ذكاء اصطناعي بـ $100B",
  "أسعار برنت تتراجع 0.8% إلى $82.1",
  "تداول يسجل أعلى مستوى في 6 أشهر",
  "مفاوضات السلام اليمنية تستأنف في مسقط",
];

export default function LandingPage() {
  const [tickerIdx, setTickerIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setTickerIdx(i => (i + 1) % NEWS_TICKER.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("ar-SA"));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const BASE = {
    direction: "rtl",
    background: "#060d18",
    color: "#e2e8f0",
    fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif",
    minHeight: "100vh",
    overflowX: "hidden",
  };

  return (
    <div style={BASE}>
      <style>{`
        @import url('${FONT_URL}');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060d18; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ticker { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .nav-link:hover { color: #22c55e !important; }
        .plan-card:hover { transform: translateY(-3px); transition: transform 0.2s; }
        .feature-card:hover { border-color: var(--accent) !important; }
        .cta-primary:hover { opacity: 0.9; transform: translateY(-1px); }
      `}</style>

      {/* ── NAVBAR ── */}
      <NavBar activePath="/" />

      {/* ── SUB BAR: Ticker + Markets + Time ── */}
      <div style={{
        background: "#080f1c",
        borderBottom: "1px solid #1e293b",
        padding: "0 20px",
        display: "flex", alignItems: "center", gap: 12,
        height: 36,
      }}>
        {/* Live ticker */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: "#ef4444", color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 5px", borderRadius: 2, flexShrink: 0, letterSpacing: 1 }}>عاجل</span>
            <div key={tickerIdx} style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "ticker 0.3s ease" }}>
              {NEWS_TICKER[tickerIdx]}
            </div>
          </div>
        </div>

        {/* Markets */}
        {[
          { l: "تاسي", v: "12,847", c: "+0.4%", up: true },
          { l: "برنت", v: "$82.1",  c: "-0.8%", up: false },
          { l: "ذهب",  v: "$2,318", c: "+0.3%", up: true },
        ].map(s => (
          <div key={s.l} style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 9, color: "#475569" }}>{s.l}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#f8fafc", fontVariantNumeric: "tabular-nums" }}>{s.v}</div>
            <div style={{ fontSize: 9, color: s.up ? "#22c55e" : "#ef4444" }}>{s.c}</div>
          </div>
        ))}

        <div style={{ width: 1, height: 20, background: "#1e293b", flexShrink: 0 }} />

        {/* Time */}
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: "#475569" }}>الرياض</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", fontVariantNumeric: "tabular-nums" }}>{time}</div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={{ padding: "80px 40px 60px", textAlign: "center", position: "relative", animation: "fadeIn 0.6s ease" }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 300, background: "radial-gradient(ellipse, #22c55e08, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#22c55e12", border: "1px solid #22c55e33", borderRadius: 3, padding: "4px 12px", fontSize: 10, color: "#22c55e", fontWeight: 700, letterSpacing: 1, marginBottom: 24 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 1s infinite" }} />
          مباشر — رصد ٢٤/٧ للشرق الأوسط وشمال أفريقيا
        </div>

        <h1 style={{ fontSize: 48, fontWeight: 800, color: "#f8fafc", lineHeight: 1.25, margin: "0 0 16px", letterSpacing: -0.5 }}>
          منصة الذكاء الاستراتيجي<br />
          <span style={{ color: "#22c55e" }}>للشرق الأوسط</span>
        </h1>

        <p style={{ fontSize: 16, color: "#64748b", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.8 }}>
          تحليلات جيوسياسية فورية، خرائط تفاعلية، ومؤشرات أمنية واقتصادية لصانعي القرار في المنطقة.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/free" className="cta-primary" style={{ padding: "10px 24px", borderRadius: 4, background: "#22c55e", color: "#000", fontWeight: 700, fontSize: 13, textDecoration: "none", transition: "all 0.2s" }}>
            🗺️ استكشف الخريطة مجاناً
          </a>
          <a href="/ops" style={{ padding: "10px 24px", borderRadius: 4, background: "transparent", border: "1px solid #1e293b", color: "#94a3b8", fontSize: 13, textDecoration: "none", transition: "all 0.2s" }}>
            ▶ غرفة العمليات
          </a>
        </div>

        {/* Hero preview card — نفس نمط بطاقات OpsRoom */}
        <div style={{ maxWidth: 800, margin: "52px auto 0" }}>
          <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, overflow: "hidden" }}>
            {/* Card header */}
            <div style={{ background: "#080f1c", borderBottom: "1px solid #1e293b", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}><img src="/logo-sm.png" alt="" style={{ height: 16 }} /> مباشر</span>
              <div style={{ display: "flex", gap: 8 }}>
                {["اليمن 88", "السودان 80", "إيران 72"].map((t, i) => (
                  <span key={t} style={{ background: ["#7f1d1d", "#7f1d1d", "#92400e"][i], color: ["#fca5a5", "#fca5a5", "#fcd34d"][i], fontSize: 9, padding: "2px 7px", borderRadius: 3, fontWeight: 700 }}>{t}</span>
                ))}
              </div>
            </div>
            {/* Fake map area */}
            <div style={{ height: 240, background: "#080f1c", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 65% 45%, #ef444408, transparent 35%), radial-gradient(circle at 35% 55%, #22c55e06, transparent 30%)", pointerEvents: "none" }} />
              {/* Hotspot dots */}
              {[
                { x: "65%", y: "60%", c: "#ef4444", s: 36, l: "88" },
                { x: "50%", y: "45%", c: "#ef4444", s: 28, l: "80" },
                { x: "75%", y: "35%", c: "#f59e0b", s: 24, l: "72" },
                { x: "40%", y: "38%", c: "#22c55e", s: 20, l: "12" },
                { x: "60%", y: "28%", c: "#3b82f6", s: 20, l: "30" },
              ].map((p, i) => (
                <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: p.s, height: p.s, borderRadius: "50%", background: p.c + "18", border: `1.5px solid ${p.c}`, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", justifyContent: "center", color: p.c, fontSize: 9, fontWeight: 700 }}>
                  {p.l}
                </div>
              ))}
              <div style={{ position: "relative", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#334155", marginBottom: 8 }}>خريطة الشرق الأوسط التفاعلية</div>
                <a href="/free" style={{ display: "inline-block", padding: "6px 16px", borderRadius: 4, background: "#22c55e", color: "#000", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>افتح الخريطة</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ borderTop: "1px solid #1e293b", borderBottom: "1px solid #1e293b", padding: "20px 40px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
          {STATS.map((s, i) => (
            <div key={s.l} style={{ textAlign: "center", borderLeft: i > 0 ? "1px solid #1e293b" : "none", padding: "0 20px" }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#22c55e", fontVariantNumeric: "tabular-nums" }}>{s.n}</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ padding: "60px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: "#475569", letterSpacing: 3, marginBottom: 10 }}>الميزات</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc" }}>كل ما تحتاجه في منصة واحدة</h2>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card" style={{ "--accent": f.color, background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, padding: "20px 18px", transition: "border-color 0.2s" }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f8fafc", marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: "60px 40px", borderTop: "1px solid #1e293b" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: "#475569", letterSpacing: 3, marginBottom: 10 }}>الأسعار</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc" }}>خطط تناسب احتياجاتك</h2>
        </div>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, alignItems: "start" }}>
          {PLANS.map(p => (
            <div key={p.name} className="plan-card" style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 6, padding: "24px 20px", position: "relative", boxShadow: p.badge ? `0 0 20px ${p.accent}11` : "none" }}>
              {p.badge && (
                <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: p.accent, color: "#000", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 2, letterSpacing: 1 }}>{p.badge}</div>
              )}
              <div style={{ fontSize: 13, fontWeight: 700, color: p.accent, marginBottom: 4, letterSpacing: 1 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 3 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: "#f8fafc" }}>{p.price}</span>
                <span style={{ fontSize: 12, color: "#475569" }}>{p.period}</span>
              </div>
              <div style={{ height: 1, background: p.border, margin: "14px 0" }} />
              {p.features.map(f => (
                <div key={f} style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 8 }}>
                  <span style={{ color: p.accent, fontSize: 11 }}>✓</span>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{f}</span>
                </div>
              ))}
              <a href="/login" style={{ display: "block", textAlign: "center", marginTop: 18, padding: "9px 0", borderRadius: 4, background: p.ctaBg, color: p.ctaColor, fontWeight: 700, fontSize: 12, textDecoration: "none", border: `1px solid ${p.border}` }}>
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER CTA ── */}
      <section style={{ padding: "50px 40px", borderTop: "1px solid #1e293b", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#475569", letterSpacing: 3, marginBottom: 10 }}>التقرير اليومي</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>ابدأ بتقرير صباحي مجاني</h2>
        <p style={{ fontSize: 13, color: "#475569", marginBottom: 28 }}>انضم لأكثر من ١٢,٠٠٠ محلل وصانع قرار يستخدمون MENA Watch</p>
        {!submitted ? (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", maxWidth: 400, margin: "0 auto" }}>
            <input type="email" placeholder="بريدك الإلكتروني" value={email} onChange={e => setEmail(e.target.value)}
              style={{ flex: 1, padding: "9px 12px", borderRadius: 4, border: "1px solid #1e293b", background: "#0a1628", color: "#e2e8f0", fontSize: 12, textAlign: "right", outline: "none", fontFamily: "inherit" }} />
            <button onClick={() => setSubmitted(true)}
              style={{ padding: "9px 20px", borderRadius: 4, background: "#22c55e", color: "#000", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              اشترك
            </button>
          </div>
        ) : (
          <div style={{ background: "#064e3b", border: "1px solid #22c55e44", borderRadius: 4, padding: "10px 24px", display: "inline-block", color: "#6ee7b7", fontSize: 13, fontWeight: 600 }}>
            ✅ تم التسجيل! ستصل أول رسالة صباحاً
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: "1px solid #1e293b", padding: "14px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#080f1c" }}>
        <div style={{ fontSize: 10, color: "#334155", display: "flex", alignItems: "center", gap: 6 }}><img src="/logo-sm.png" alt="" style={{ height: 14, opacity: 0.5 }} /> © 2025 MENA Watch — منصة الاستخبارات الإقليمية</div>
        <div style={{ display: "flex", gap: 16 }}>
          {["الخصوصية", "الشروط", "تواصل معنا"].map(l => (
            <a key={l} href="#" style={{ fontSize: 10, color: "#334155", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
