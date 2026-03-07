"use client";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/", label: "الرئيسية", icon: "🏠" },
  { href: "/map", label: "الخريطة", icon: "🗺️" },
  { href: "/free", label: "المجاني", icon: "📡" },
  { href: "/ops", label: "غرفة العمليات", icon: "🛡️", requireAuth: true },
  { href: "/profile", label: "حسابي", icon: "👤", requireAuth: true },
  { href: "/admin", label: "الأدمن", icon: "⚙️", requireAdmin: true },
];

export default function NavBar({ activePath = "/" }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    import("../../lib/supabase").then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
        if (data.user) {
          supabase.from("profiles").select("role, full_name, email").eq("id", data.user.id).single()
            .then(({ data: p }) => setProfile(p));
        }
      });
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    import("../../lib/supabase").then(({ supabase }) => {
      supabase.auth.signOut().then(() => { window.location.href = "/"; });
    });
  };

  const visibleItems = NAV_ITEMS.filter(item => {
    if (item.requireAdmin && profile?.role !== "admin") return false;
    if (item.requireAuth && !user) return false;
    return true;
  });

  return (
    <nav style={{
      background: "linear-gradient(90deg, #0a1628 0%, #0f1f3d 50%, #0a1628 100%)",
      borderBottom: "1px solid #1e293b",
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      height: 48,
      position: "sticky",
      top: 0,
      zIndex: 1000,
      direction: "rtl",
      fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    }}>
      {/* Logo */}
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
        <img src="/logo-sm.png" alt="MENA.Watch" style={{ height: 30, width: "auto" }} />
      </a>

      {/* Divider */}
      <div style={{ width: 1, height: 28, background: "#1e293b", flexShrink: 0 }} />

      {/* Nav Links */}
      <div style={{ display: "flex", gap: 2, alignItems: "center", overflow: "hidden" }}>
        {visibleItems.map(item => {
          const isActive = activePath === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                padding: "6px 10px",
                borderRadius: 4,
                fontSize: 11,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? "#22c55e" : "#64748b",
                background: isActive ? "#22c55e11" : "transparent",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 12 }}>{item.icon}</span>
              {item.label}
            </a>
          );
        })}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Auth Section */}
      {user ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>
            {profile?.full_name || user.email?.split("@")[0] || "مستخدم"}
          </span>
          {profile?.role && (
            <span style={{
              fontSize: 9,
              padding: "2px 6px",
              borderRadius: 3,
              fontWeight: 700,
              background: profile.role === "admin" ? "#f59e0b22" : "#22c55e22",
              color: profile.role === "admin" ? "#f59e0b" : "#22c55e",
              border: `1px solid ${profile.role === "admin" ? "#f59e0b33" : "#22c55e33"}`,
            }}>
              {profile.role === "admin" ? "أدمن" : profile.role === "pro" ? "خبير" : "مجاني"}
            </span>
          )}
          <button
            onClick={handleLogout}
            style={{
              background: "#7f1d1d",
              border: "none",
              borderRadius: 4,
              padding: "5px 10px",
              color: "#ef4444",
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            خروج
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <a href="/free" style={{
            padding: "5px 12px",
            borderRadius: 4,
            background: "transparent",
            border: "1px solid #1e293b",
            color: "#64748b",
            fontSize: 11,
            textDecoration: "none",
          }}>
            استكشف مجانا
          </a>
          <a href="/login" style={{
            padding: "5px 12px",
            borderRadius: 4,
            background: "#22c55e",
            color: "#000",
            fontSize: 11,
            fontWeight: 700,
            textDecoration: "none",
          }}>
            دخول
          </a>
        </div>
      )}
    </nav>
  );
}
