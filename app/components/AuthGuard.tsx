"use client";
import { useState, useEffect } from "react";

/**
 * Client-side auth guard — redirects to /login if no Supabase session.
 * Acts as a safety net alongside middleware server-side auth checks.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    import("../../lib/supabase").then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }: any) => {
        if (!data?.user) {
          window.location.href = "/login";
        } else {
          setReady(true);
        }
      });
    }).catch(() => {
      window.location.href = "/login";
    });
  }, []);

  if (!ready) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#060d18",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#475569",
        fontFamily: "'IBM Plex Sans Arabic', sans-serif",
        direction: "rtl",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8, animation: "pulse 1.5s infinite" }}>🔐</div>
          <div style={{ fontSize: 13 }}>جاري التحقق من الصلاحيات...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
