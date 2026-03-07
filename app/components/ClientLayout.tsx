"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

// Pages where NavBar should NOT appear
const HIDE_NAVBAR_PATHS = ["/login", "/reset-password", "/auth/callback"];

function NavBarLoader({ activePath }: { activePath: string }) {
  const [NavBar, setNavBar] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    import("./NavBar")
      .then((mod) => {
        setNavBar(() => mod.default);
      })
      .catch((err) => {
        console.error("NavBar load error:", err);
        setError(err?.message || "Failed to load NavBar");
      });
  }, []);

  if (error) {
    return (
      <div style={{ background: "#7f1d1d", color: "#fca5a5", padding: "8px 16px", fontSize: 12, textAlign: "center" }}>
        NavBar Error: {error}
      </div>
    );
  }

  if (!NavBar) return null;

  return <NavBar activePath={activePath} />;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavBar = !HIDE_NAVBAR_PATHS.some(p => pathname.startsWith(p));

  return (
    <>
      {showNavBar && <NavBarLoader activePath={pathname} />}
      {children}
    </>
  );
}
