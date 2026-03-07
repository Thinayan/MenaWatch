"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function handleSubmit() {
    setLoading(true); setMsg(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/map";
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
        if (error) throw error;
        setMsg({ type: "success", text: "✅ تم إرسال رابط التأكيد إلى بريدك الإلكتروني" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/reset-password` });
        if (error) throw error;
        setMsg({ type: "success", text: "✅ تم إرسال رابط إعادة تعيين كلمة المرور" });
      }
    } catch (e) {
      setMsg({ type: "error", text: e.message });
    }
    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback` } });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060d18", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Sans Arabic',sans-serif", direction: "rtl", padding: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap');*{box-sizing:border-box}`}</style>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/">
            <img src="/logo-md.png" alt="MENA.Watch — مراقب الشرق الأوسط" style={{ height: 100, width: "auto", margin: "0 auto" }} />
          </a>
        </div>

        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 28 }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "#060d18", borderRadius: 8, padding: 3 }}>
            {[{ id: "login", label: "تسجيل الدخول" }, { id: "signup", label: "إنشاء حساب" }].map(t => (
              <button key={t.id} onClick={() => { setMode(t.id); setMsg(null); }} style={{
                flex: 1, padding: "9px", borderRadius: 6, border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                background: mode === t.id ? "#22c55e" : "transparent",
                color: mode === t.id ? "#fff" : "#64748b",
              }}>{t.label}</button>
            ))}
          </div>

          {/* Google */}
          <button onClick={handleGoogle} style={{ width: "100%", padding: "11px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, color: "#e2e8f0", fontFamily: "inherit", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            المتابعة مع Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
            <span style={{ fontSize: 11, color: "#475569" }}>أو</span>
            <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="البريد الإلكتروني"
              style={{ padding: "11px 14px", background: "#060d18", border: "1px solid #1e293b", borderRadius: 8, color: "#e2e8f0", fontFamily: "inherit", fontSize: 13, outline: "none", direction: "ltr" }} />
            {mode !== "reset" && (
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="كلمة المرور"
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ padding: "11px 14px", background: "#060d18", border: "1px solid #1e293b", borderRadius: 8, color: "#e2e8f0", fontFamily: "inherit", fontSize: 13, outline: "none", direction: "ltr" }} />
            )}
          </div>

          {msg && (
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 6, background: msg.type==="success"?"#14532d":"#7f1d1d", color: msg.type==="success"?"#22c55e":"#ef4444", fontSize: 12 }}>{msg.text}</div>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{ marginTop: 16, width: "100%", padding: "12px", background: "linear-gradient(135deg,#22c55e,#16a34a)", border: "none", borderRadius: 8, color: "#fff", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: loading?"not-allowed":"pointer", opacity: loading?0.7:1 }}>
            {loading ? "جارٍ التحميل..." : mode==="login" ? "تسجيل الدخول" : mode==="signup" ? "إنشاء حساب مجاني" : "إرسال رابط الاستعادة"}
          </button>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between" }}>
            {mode === "login" && <button onClick={() => setMode("reset")} style={{ background: "none", border: "none", color: "#64748b", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>نسيت كلمة المرور؟</button>}
            {mode === "reset" && <button onClick={() => setMode("login")} style={{ background: "none", border: "none", color: "#64748b", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>← العودة</button>}
          </div>
        </div>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            {["📡 بيانات فورية", "🔒 آمن 100%", "🆓 مجاني للبدء"].map(f => (
              <span key={f} style={{ fontSize: 11, color: "#475569" }}>{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
