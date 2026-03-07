"use client";
import { useState, useEffect } from "react";

const FONT_URL = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap";

function useCountdown(target) {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

const FEATURES_COMING = [
  { icon: "\u{1F6E1}\uFE0F", label: "\u062E\u0631\u064A\u0637\u0629 \u0623\u0645\u0646\u064A\u0629 \u062A\u0641\u0627\u0639\u0644\u064A\u0629", status: "\u062C\u0627\u0647\u0632 100%", color: "#22c55e", done: true },
  { icon: "\u26A1", label: "\u0644\u0648\u062D\u0629 \u0627\u0642\u062A\u0635\u0627\u062F\u064A\u0629 \u062D\u064A\u0629", status: "\u062C\u0627\u0647\u0632 100%", color: "#22c55e", done: true },
  { icon: "\u{1F916}", label: "\u062A\u062D\u0644\u064A\u0644 Claude AI", status: "\u062C\u0627\u0647\u0632 100%", color: "#22c55e", done: true },
  { icon: "\u{1F4E1}", label: "\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0641\u0648\u0631\u064A\u0629", status: "\u0642\u0631\u064A\u0628\u0627\u064B", color: "#f59e0b", done: false },
  { icon: "\u{1F4CA}", label: "\u062A\u0642\u0627\u0631\u064A\u0631 PDF \u062A\u0644\u0642\u0627\u0626\u064A\u0629", status: "\u0642\u0631\u064A\u0628\u0627\u064B", color: "#f59e0b", done: false },
  { icon: "\u{1F517}", label: "API \u0644\u0644\u0645\u0637\u0648\u0631\u064A\u0646", status: "\u0642\u0631\u064A\u0628\u0627\u064B", color: "#3b82f6", done: false },
];

/**
 * SignupGateModal — popup that blocks browsing until the visitor
 * signs up with email + password (quick registration).
 *
 * - Shown for unauthenticated visitors on all pages except /login, /reset-password
 * - On successful signup  -> redirects to /map
 * - Sends Supabase confirmation email automatically (user completes profile later)
 * - Stores a flag so the gate doesn't re-appear after signup
 */
export default function SignupGateModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("form"); // form | success | login
  const [count, setCount] = useState(2347);
  const t = useCountdown("2025-12-01T00:00:00");

  const handleSignup = async () => {
    setError("");
    if (!email.trim()) { setError("\u0623\u062F\u062E\u0644 \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A"); return; }
    if (password.length < 6) { setError("\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 6 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644"); return; }

    setLoading(true);
    try {
      const { supabase } = await import("../../lib/supabase");

      // Try signup first
      const { data, error: signupErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (signupErr) {
        // If user already exists, try to sign in instead
        if (signupErr.message?.includes("already registered") || signupErr.message?.includes("already exists")) {
          setStep("login");
          setError("\u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u064A\u062F \u0645\u0633\u062C\u0644 \u0645\u0633\u0628\u0642\u0627\u064B. \u0633\u062C\u0651\u0644 \u062F\u062E\u0648\u0644\u0643:");
          setLoading(false);
          return;
        }
        setError(signupErr.message || "\u062D\u062F\u062B \u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u062A\u0633\u062C\u064A\u0644");
        setLoading(false);
        return;
      }

      // If signup returned a session, user is logged in
      if (data?.session) {
        setCount(c => c + 1);
        setStep("success");
        setTimeout(() => { window.location.href = "/map"; }, 1500);
      } else if (data?.user && !data?.session) {
        // Supabase email confirmation is ON — auto sign-in anyway
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
          // Show success message — email confirm needed
        }
      }
    } catch (e) {
      setError("\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u0627\u062A\u0635\u0627\u0644. \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649.");
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password) { setError("\u0623\u062F\u062E\u0644 \u0627\u0644\u0628\u0631\u064A\u062F \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"); return; }
    setLoading(true);
    try {
      const { supabase } = await import("../../lib/supabase");
      const { error: loginErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (loginErr) {
        setError("\u0628\u0631\u064A\u062F \u0623\u0648 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629");
      } else {
        setStep("success");
        setTimeout(() => { window.location.href = "/map"; }, 1000);
      }
    } catch (e) {
      setError("\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u0627\u062A\u0635\u0627\u0644");
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
        maxWidth: 960,
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
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
            \u0645\u0646\u0635\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A \u0644\u0644\u0634\u0631\u0642 \u0627\u0644\u0623\u0648\u0633\u0637
          </span>
        </div>

        {/* Main content — 2 columns */}
        <div style={{ display: "flex", padding: "28px 24px", gap: 24, flexWrap: "wrap" }}>

          {/* RIGHT — Info + Form */}
          <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#22c55e12", border: "1px solid #22c55e33", borderRadius: 3,
              padding: "4px 10px", fontSize: 10, color: "#22c55e", fontWeight: 700,
              letterSpacing: 1, marginBottom: 18, width: "fit-content",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "gatePulse 1s infinite" }} />
              \u0642\u064A\u062F \u0627\u0644\u062A\u0637\u0648\u064A\u0631 \u0627\u0644\u0646\u0647\u0627\u0626\u064A
            </div>

            <h1 style={{ fontSize: 36, fontWeight: 800, color: "#f8fafc", lineHeight: 1.2, marginBottom: 10 }}>
              \u0627\u0644\u0625\u0637\u0644\u0627\u0642 \u0627\u0644\u0631\u0633\u0645\u064A<br />
              <span style={{ color: "#22c55e" }}>\u0642\u0631\u064A\u0628\u0627\u064B</span>
            </h1>

            <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, marginBottom: 24, maxWidth: 420 }}>
              \u0645\u0646\u0635\u0629 MENA Watch \u062A\u0633\u062A\u0639\u062F \u0644\u0644\u0625\u0637\u0644\u0627\u0642 \u0627\u0644\u0643\u0627\u0645\u0644. \u0633\u062C\u0651\u0644 \u0627\u0644\u0622\u0646 \u0644\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u0649 \u0648\u0635\u0648\u0644 \u0645\u0628\u0643\u0631 \u0648\u062A\u0642\u0631\u064A\u0631 \u062A\u062C\u0631\u064A\u0628\u064A \u0645\u062C\u0627\u0646\u064A.
            </p>

            {/* FORM */}
            {step === "success" ? (
              <div style={{
                background: "#064e3b", border: "1px solid #22c55e44",
                borderRadius: 6, padding: "16px 20px", color: "#6ee7b7",
                fontSize: 14, fontWeight: 700, textAlign: "center",
              }}>
                \u2705 \u062A\u0645 \u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0628\u0646\u062C\u0627\u062D! \u062C\u0627\u0631\u064A \u0627\u0644\u062A\u0648\u062C\u064A\u0647...
              </div>
            ) : (
              <div>
                {/* Email */}
                <input
                  type="email"
                  className="gate-input"
                  placeholder="\u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A"
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
                  placeholder="\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 (6 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644)"
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
                        {loading ? "\u062C\u0627\u0631\u064A..." : "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644"}
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
                        \u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F
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
                      {loading ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u0633\u062C\u064A\u0644..." : "\u2190 \u062C\u0631\u0628 \u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u062A\u062C\u0631\u064A\u0628\u064A\u0629 \u0627\u0644\u0622\u0646"}
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
                    \u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628 \u0628\u0627\u0644\u0641\u0639\u0644\u061F \u0633\u062C\u0651\u0644 \u062F\u062E\u0648\u0644
                  </button>
                )}

                <div style={{ fontSize: 11, color: "#475569", marginTop: 12 }}>
                  \u0627\u0646\u0636\u0645 \u0644\u0640 {count.toLocaleString("ar-SA")} \u0641\u064A \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631
                </div>
              </div>
            )}

            {/* Progress bar */}
            <div style={{ marginTop: 24, background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#cbd5e1" }}>\u062A\u0642\u062F\u0645 \u0627\u0644\u062A\u0637\u0648\u064A\u0631 \u0627\u0644\u0643\u0644\u064A</span>
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

          {/* LEFT — Countdown + Stats */}
          <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>

            {/* Countdown */}
            <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ background: "#080f1c", borderBottom: "1px solid #1e293b", padding: "8px 14px", fontSize: 11, color: "#cbd5e1", letterSpacing: 2 }}>
                \u0627\u0644\u0639\u062F \u0627\u0644\u062A\u0646\u0627\u0632\u0644\u064A \u0644\u0644\u0625\u0637\u0644\u0627\u0642
              </div>
              <div style={{ padding: "18px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { v: t.d, l: "\u064A\u0648\u0645" },
                  { v: t.h, l: "\u0633\u0627\u0639\u0629" },
                  { v: t.m, l: "\u062F\u0642\u064A\u0642\u0629" },
                  { v: t.s, l: "\u062B\u0627\u0646\u064A\u0629" },
                ].map(c => (
                  <div key={c.l} style={{ background: "#080f1c", border: "1px solid #1e293b", borderRadius: 4, padding: "12px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 30, fontWeight: 800, color: "#22c55e", fontVariantNumeric: "tabular-nums" }}>
                      {String(c.v).padStart(2, "0")}
                    </div>
                    <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 4 }}>{c.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Waitlist by country */}
            <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 6, padding: "14px" }}>
              <div style={{ fontSize: 11, color: "#cbd5e1", letterSpacing: 2, marginBottom: 12 }}>
                \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631
              </div>
              {[
                { flag: "\u{1F1F8}\u{1F1E6}", label: "\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629", n: "843" },
                { flag: "\u{1F1E6}\u{1F1EA}", label: "\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A", n: "431" },
                { flag: "\u{1F1F6}\u{1F1E6}", label: "\u0642\u0637\u0631", n: "312" },
                { flag: "\u{1F30D}", label: "\u062F\u0648\u0644 \u0623\u062E\u0631\u0649", n: "771" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 15 }}>{r.flag}</span>
                  <span style={{ flex: 1, fontSize: 12, color: "#cbd5e1" }}>{r.label}</span>
                  <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 700 }}>{r.n}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #1e293b", paddingTop: 8, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#cbd5e1" }}>\u0627\u0644\u0645\u062C\u0645\u0648\u0639</span>
                <span style={{ fontSize: 12, color: "#f8fafc", fontWeight: 700 }}>{count.toLocaleString("ar-SA")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
