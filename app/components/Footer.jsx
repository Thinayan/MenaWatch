import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/about", label: "من نحن" },
  { href: "/search", label: "البحث" },
  { href: "/archive", label: "الأرشيف" },
  { href: "/about#contact", label: "تواصل معنا" },
];

export default function Footer() {
  return (
    <footer
      dir="rtl"
      style={{
        background: "#080f1c",
        borderTop: "1px solid #1e293b",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
        fontFamily: "inherit",
      }}
    >
      {/* Left side (appears right in RTL): copyright + logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img
          src="/logo-sm.png"
          alt="MENA Watch"
          style={{ height: 20, width: "auto", opacity: 0.85 }}
        />
        <span
          style={{
            fontSize: 11,
            color: "#94a3b8",
            whiteSpace: "nowrap",
          }}
        >
          &copy; 2026 MENA Watch &mdash; منصة التحليل والذكاء الاستراتيجي الإقليمية
        </span>
      </div>

      {/* Right side (appears left in RTL): nav links */}
      <nav style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontSize: 11,
              color: "#94a3b8",
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e8f0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
