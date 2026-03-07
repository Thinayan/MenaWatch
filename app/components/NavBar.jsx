"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";

const NAV_ITEMS = [
  { href: "/", label: "الرئيسية", icon: "🏠" },
  { href: "/map", label: "الخريطة", icon: "🗺️" },
  { href: "/free", label: "المجاني", icon: "📡" },
  { href: "/about", label: "من نحن", icon: "ℹ️" },
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
    <>
      {/* Desktop NavBar */}
      <nav style={{
        background: "linear-gradient(90deg, #0a1628 0%, #0f1f3d 50%, #0a1628 100%)",
        borderBottom: "1px solid #1e293b",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        height: 52,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        direction: "rtl",
        fontFamily: "'IBM Plex Sans Arabic', sans-serif",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
          <img src="/logo-sm.png" alt="MENA.Watch" style={{ height: 32, width: "auto" }} />
        </Link>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: "#1e293b", flexShrink: 0 }} />

        {/* Nav Links — Desktop */}
        <div style={{ display: "flex", gap: 4, alignItems: "center", overflow: "hidden" }}>
          {visibleItems.map(item => {
            const isActive = activePath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#22c55e" : "#94a3b8",
                  background: isActive ? "#22c55e11" : "transparent",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Search Bar */}
        <SearchBar compact />

        {/* Auth Section */}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              {profile?.full_name || user.email?.split("@")[0] || "مستخدم"}
            </span>
            {profile?.role && (
              <span style={{
                fontSize: 10,
                padding: "3px 8px",
                borderRadius: 4,
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
                borderRadius: 6,
                padding: "6px 14px",
                color: "#ef4444",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
              }}
            >
              خروج
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <Link href="/free" style={{
              padding: "7px 16px",
              borderRadius: 6,
              background: "transparent",
              border: "1px solid #1e293b",
              color: "#94a3b8",
              fontSize: 13,
              textDecoration: "none",
              fontWeight: 500,
            }}>
              استكشف مجانا
            </Link>
            <Link href="/login" style={{
              padding: "7px 16px",
              borderRadius: 6,
              background: "#22c55e",
              color: "#000",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
            }}>
              دخول
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "#94a3b8",
            fontSize: 20,
            cursor: "pointer",
            padding: 4,
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div style={{
          background: "#0a1628",
          borderBottom: "1px solid #1e293b",
          padding: "12px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          position: "sticky",
          top: 52,
          zIndex: 999,
          direction: "rtl",
          fontFamily: "'IBM Plex Sans Arabic', sans-serif",
        }}>
          {visibleItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "10px 14px",
                borderRadius: 6,
                fontSize: 14,
                color: activePath === item.href ? "#22c55e" : "#94a3b8",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
