"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [msg, setMsg] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // 1. Check for code in URL (PKCE flow from email link)
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!cancelled) {
            if (error) {
              setMsg({ type: "error", text: "رابط إعادة التعيين منتهي الصلاحية. يرجى طلب رابط جديد من صفحة تسجيل الدخول." });
              setInitializing(false);
            } else {
              // Clean URL
              window.history.replaceState({}, "", "/reset-password");
              setSessionReady(true);
              setInitializing(false);
            }
          }
          return;
        }

        // 2. Check for hash fragment (implicit flow — type=recovery)
        const hash = window.location.hash;
        if (hash && hash.includes("type=recovery")) {
          await new Promise(r => setTimeout(r, 800));
          const { data } = await supabase.auth.getSession();
          if (!cancelled && data.session) {
            setSessionReady(true);
            setInitializing(false);
            return;
          }
        }

        // 3. Check existing session
        const { data } = await supabase.auth.getSession();
        if (!cancelled && data.session) {
          setSessionReady(true);
          setInitializing(false);
          return;
        }

        // 4. Listen for PASSWORD_RECOVERY event
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
          if (cancelled) return;
          if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session) {
            setSessionReady(true);
            setInitializing(false);
          }
        });

        // Timeout — 4 seconds
        setTimeout(() => {
          if (!cancelled) {
            setInitializing(prev => {
              if (prev) {
                setMsg({ type: "error", text: "يرجى استخدام رابط إعادة التعيين المرسل لبريدك الإلكتروني." });
                return false;
              }
              return prev;
            });
          }
        }, 4000);

        return () => {
          listener?.subscription?.unsubscribe();
        };
      } catch (e) {
        if (!cancelled) {
          setMsg({ type: "error", text: "حدث خطأ. يرجى المحاولة مرة أخرى." });
          setInitializing(false);
        }
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  async function handleUpdate() {
    if (password.length < 6) {
      setMsg({ type: "error", text: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      return;
    }
    if (password !== confirm) {
      setMsg({ type: "error", text: "كلمة المرور غير متطابقة" });
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setMsg({ type: "success", text: "تم تحديث كلمة المرور بنجاح" });
      setTimeout(() => {
        window.location.href = "/map";
      }, 2000);
    } catch (e) {
      setMsg({ type: "error", text: e.message });
    }
    setLoading(false);
  }

  const inputStyle = {
    padding: "14px 16px",
    background: "#060d18",
    border: "1px solid #1e293b",
    borderRadius: 8,
    color: "#e2e8f0",
    fontFamily: "inherit",
    fontSize: 15,
    outline: "none",
    direction: "ltr",
    width: "100%",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060d18",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'IBM Plex Sans Arabic',sans-serif",
      direction: "rtl",
      padding: 20,
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap');*{box-sizing:border-box}`}</style>

      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/">
            <img src="/logo-md.png" alt="MENA.Watch" style={{ height: 100, width: "auto", margin: "0 auto" }} />
          </a>
        </div>

        <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 28 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🔐</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f8fafc", margin: 0 }}>تعيين كلمة مرور جديدة</h1>
            <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 8 }}>أدخل كلمة المرور الجديدة لحسابك</p>
          </div>

          {/* Loading */}
          {initializing && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>⏳</div>
              <div style={{ fontSize: 14, color: "#94a3b8" }}>جارٍ التحقق من الرابط...</div>
            </div>
          )}

          {/* Error — no session */}
          {!initializing && !sessionReady && msg && (
            <div style={{ textAlign: "center" }}>
              <div style={{
                padding: "16px",
                borderRadius: 8,
                background: "#7f1d1d",
                color: "#ef4444",
                fontSize: 14,
                marginBottom: 16,
                lineHeight: 1.7,
              }}>
                {msg.text}
              </div>
              <a href="/login" style={{
                display: "inline-block",
                padding: "12px 32px",
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                borderRadius: 8,
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}>
                العودة لتسجيل الدخول
              </a>
            </div>
          )}

          {/* Password Form */}
          {!initializing && sessionReady && !done && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6, display: "block" }}>كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="6 أحرف على الأقل"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6, display: "block" }}>تأكيد كلمة المرور</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="أعد كتابة كلمة المرور"
                  onKeyDown={e => e.key === "Enter" && handleUpdate()}
                  style={inputStyle}
                />
              </div>

              {msg && (
                <div style={{
                  padding: "12px 14px",
                  borderRadius: 6,
                  background: msg.type === "success" ? "#14532d" : "#7f1d1d",
                  color: msg.type === "success" ? "#22c55e" : "#ef4444",
                  fontSize: 13,
                }}>
                  {msg.text}
                </div>
              )}

              <button
                onClick={handleUpdate}
                disabled={loading}
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg,#22c55e,#16a34a)",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontFamily: "inherit",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
              </button>
            </div>
          )}

          {/* Success */}
          {done && (
            <div style={{ textAlign: "center" }}>
              <div style={{
                padding: "16px",
                borderRadius: 8,
                background: "#14532d",
                color: "#22c55e",
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 16,
              }}>
                ✅ تم تحديث كلمة المرور بنجاح!
              </div>
              <p style={{ fontSize: 14, color: "#94a3b8" }}>جارٍ تحويلك لغرفة العمليات...</p>
            </div>
          )}
        </div>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <a href="/login" style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none" }}>← العودة لتسجيل الدخول</a>
        </div>
      </div>
    </div>
  );
}
