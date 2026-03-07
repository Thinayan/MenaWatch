"use client";
import { useState, useEffect } from "react";

const FONT_URL = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap";

const FEATURES_COMING = [
  { icon: "🛡️", label: "خريطة أمنية تفاعلية", status: "جاهز 100%", color: "#22c55e", done: true },
  { icon: "⚡", label: "لوحة اقتصادية حية", status: "جاهز 100%", color: "#22c55e", done: true },
  { icon: "🤖", label: "تحليل Claude AI", status: "جاهز 100%", color: "#22c55e", done: true },
  { icon: "📡", label: "تنبيهات فورية", status: "قريباً", color: "#f59e0b", done: false },
  { icon: "📊", label: "تقارير PDF تلقائية", status: "قريباً", color: "#f59e0b", done: false },
  { icon: "🔗", label: "API للمطورين", status: "قريباً", color: "#3b82f6", done: false },
];

export default function SignupGateModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("form");
  const [count, setCount] = useState(2347);

  const handleSignup = async () => {
    setError("");
    if (!email.trim()) { setError("أدخل بريدك الإلكتروني"); return; }
    if (password.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }

    setLoading(true);
    try {
      const { supabase } = await import("../../lib/supabase");
      const { data, error: signupErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (signupErr) {
        if (signupErr.message?.includes("already registered") || signupErr.message?.includes("already exists")) {
          setStep("login");
          setError("هذا البريد مسجل مسبقاً. سجّل دخولك:");
          setLoading(false);
          return;
        }
        setError(signupErr.message || "حدث خطأ في التسجيل");
        setLoading(false);
        return;
      }

      if (data?.session) {
        setCount(c => c + 1);
        setStep("success");
        setTimeout(() => { window.location.href = "/map"; }, 1500);
      } else if (data?.user && !data?.session) {
        const { error: loginErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (!loginErr) {
          setCount(c => c + 1);
          setStep("success");
          setTimeout(() => { window.location.href = "/map"; }, 1500);
        } else {
          setStep("success");
          setError("");
        }
      }
    } catch (e) {
      setError("خطأ في الاتصال. حاول مرة أخرى.");
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password) { setError("أدخل البريد وكلمة المرور"); return; }
    setLoading(true);
    try {
      const { supabase } = await import("../../lib/supabase");
      const { error: loginErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (loginErr) {
        setError("بريد أو كلمة مرور غير صحيحة");
      } else {
        setStep("success");
        setTimeout(() => { window.location.href = "/map"; }, 1000);
      }
    } catch (e) {
      setError("خطأ في الاتصال");
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 10000,
      background: "rgba(3, 7, 18, 0.92)",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      direction: "rtl",
      fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif",
    }}>
      <style>{`
        @import url('${FONT_URL}');
        @keyframes gatePulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes gateFadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gateScan { from{transform:translateY(-100%)} to{transform:translateY(100%)} }
        .gate-input:focus { border-color: #22c55e !important; outline: none; }
        .gate-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .gate-btn:active { transform: translateY(0); }
      `}</style>

      {/* Scan line */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: 2, background: "linear-gradient(90deg, transparent, #22c55e22, transparent)", animation: "gateScan 4s linear infinite", pointerEvents: "none" }} />

      {/* Modal Container */}
      <div style={{
        background: "#060d18",
        border: "1px solid #1e293b",
        borderRadius: 12,
        maxWidth: 580,
        width: "100%",
        maxHeight: "90vh",
        overflow: "auto",
        animation: "gateFadeIn 0.5s ease",
        position: "relative",
      }}>
        {/* Top bar */}
        <div style={{
          background: "linear-gradient(90deg, #0a1628, #0f1f3d, #0a1628)",
          borderBottom: "1px solid #1e293b",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          height: 44,
          borderRadius: "12px 12px 0 0",
        }}>
          <img src="/logo-sm.png" alt="MENA.Watch" style={{ height: 28 }} />
          <span style={{ fontSize: 11, color: "#475569" }}>|</span>
          <span style={{ fontSize: 12, color: "#cbd5e1", fontWeight: 500 }}>
            منصة الذكاء الاستراتيجي للشرق الأوسط
          </span>
        </div>

        {/* Main content */}
        <div style={{ padding: "28px 32px" }}>

          {/* Info + Form */}
          <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#22c55e12", border: "1px solid #22c55e33", borderRadius: 3,
              padding: "4px 10px", fontSize: 10, color: "#22c55e", fontWeight: 700,
              letterSpacing: 1, marginBottom: 18, width: "fit-content",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "gatePulse 1s infinite" }} />
              {"قيد التطوير النهائي"}
            </div>

            <h1 style={{ fontSize: 36, fontWeight: 800, color: "#f8fafc", lineHeight: 1.2, marginBottom: 10 }}>
              {"الإطلاق الرسمي"}<br />
              <span style={{ color: "#22c55e" }}>{"قريباً"}</span>
            </h1>

            <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, marginBottom: 24, maxWidth: 420 }}>
              {"منصة MENA Watch تستعد للإطلاق الكامل. سجّل الآن للحصول على وصول مبكر وتقرير تجريبي مجاني."}
            </p>

            {/* FORM */}
            {step === "success" ? (
              <div style={{
                background: "#064e3b", border: "1px solid #22c55e44",
                borderRadius: 6, padding: "16px 20px", color: "#6ee7b7",
                fontSize: 14, fontWeight: 700, textAlign: "center",
              }}>
                {"✅ تم التسجيل بنجاح! جاري التوجيه..."}
              </div>
            ) : (
              <div>
                {/* Email */}
                <input
                  type="email"
                  className="gate-input"
                  placeholder="بريدك الإلكتروني"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 6,
                    border: "1px solid #1e293b", background: "#0a0f1e",
                    color: "#e2e8f0", fontSize: 14, textAlign: "right",
                    fontFamily: "inherit", marginBottom: 10,
                  }}
                />
                {/* Password */}
                <input
                  type="password"
                  className="gate-input"
                  placeholder="كلمة المرور (6 أحرف على الأقل)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (step === "login" ? handleLogin() : handleSignup())}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 6,
                    border: "1px solid #1e293b", background: "#0a0f1e",
                    color: "#e2e8f0", fontSize: 14, textAlign: "right",
                    fontFamily: "inherit", marginBottom: 10,
                  }}
                />

                {/* Error */}
                {error && (
                  <div style={{
                    background: step === "login" ? "#0c1a3a" : "#7f1d1d22",
                    border: `1px solid ${step === "login" ? "#3b82f644" : "#ef444444"}`,
                    borderRadius: 4, padding: "8px 12px",
                    color: step === "login" ? "#93c5fd" : "#fca5a5",
                    fontSize: 12, marginBottom: 10,
                  }}>
                    {error}
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  {step === "login" ? (
                    <>
                      <button
                        className="gate-btn"
                        onClick={handleLogin}
                        disabled={loading}
                        style={{
                          flex: 1, padding: "12px 20px", borderRadius: 6,
                          background: "#3b82f6", color: "#fff", fontWeight: 700,
                          fontSize: 14, border: "none", cursor: loading ? "wait" : "pointer",
                          fontFamily: "inherit", transition: "all 0.15s",
                          opacity: loading ? 0.7 : 1,
                        }}
                      >
                        {loading ? "جاري..." : "تسجيل الدخول"}
                      </button>
                      <button
                        onClick={() => { setStep("form"); setError(""); }}
                        style={{
                          padding: "12px 16px", borderRadius: 6,
                          background: "transparent", border: "1px solid #1e293b",
                          color: "#94a3b8", fontSize: 12, cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {"حساب جديد"}
                      </button>
                    </>
                  ) : (
                    <button
                      className="gate-btn"
                      onClick={handleSignup}
                      disabled={loading}
                      style={{
                        flex: 1, padding: "12px 20px", borderRadius: 6,
                        background: "#22c55e", color: "#000", fontWeight: 700,
                        fontSize: 15, border: "none", cursor: loading ? "wait" : "pointer",
                        fontFamily: "inherit", transition: "all 0.15s",
                        opacity: loading ? 0.7 : 1,
                      }}
                    >
                      {loading ? "جاري التسجيل..." : "← جرب النسخة التجريبية الآن"}
                    </button>
                  )}
                </div>

                {/* Already have account toggle */}
                {step !== "login" && (
                  <button
                    onClick={() => { setStep("login"); setError(""); }}
                    style={{
                      background: "none", border: "none", color: "#3b82f6",
                      fontSize: 12, marginTop: 10, cursor: "pointer",
                      fontFamily: "inherit", textDecoration: "underline",
                    }}
                  >
                    {"لديك حساب بالفعل؟ سجّل دخول"}
                  </button>
                )}

              </div>
            )}

            {/* Progress bar */}
            <div style={{ marginTop: 24, background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#cbd5e1" }}>{"تقدم التطوير الكلي"}</span>
                <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>87%</span>
              </div>
              <div style={{ height: 5, background: "#1e293b", borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ height: "100%", width: "87%", background: "#22c55e", borderRadius: 2 }} />
              </div>
              {FEATURES_COMING.map(f => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 13 }}>{f.icon}</span>
                  <span style={{ flex: 1, fontSize: 12, color: "#cbd5e1" }}>{f.label}</span>
                  <span style={{ fontSize: 10, color: f.color, background: f.color + "18", padding: "2px 8px", borderRadius: 3, fontWeight: 700 }}>{f.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
