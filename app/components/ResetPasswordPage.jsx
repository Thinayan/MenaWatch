"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [done, setDone] = useState(false);

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
      setMsg({ type: "success", text: "✅ تم تحديث كلمة المرور بنجاح" });
      setTimeout(() => {
        window.location.href = "/ops";
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
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 8 }}>أدخل كلمة المرور الجديدة لحسابك</p>
          </div>

          {!done ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6, display: "block" }}>كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="٦ أحرف على الأقل"
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
          ) : (
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
              <p style={{ fontSize: 14, color: "#64748b" }}>جارٍ تحويلك لغرفة العمليات...</p>
            </div>
          )}
        </div>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <a href="/login" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>← العودة لتسجيل الدخول</a>
        </div>
      </div>
    </div>
  );
}
