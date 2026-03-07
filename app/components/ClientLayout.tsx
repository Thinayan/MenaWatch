"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

// Pages where NavBar should NOT appear
const HIDE_NAVBAR_PATHS = ["/login", "/reset-password", "/auth/callback"];

// Pages where the signup gate should NOT appear (login flow pages)
const SKIP_GATE_PATHS = ["/login", "/reset-password", "/auth/callback"];

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

function SignupGateLoader() {
  const [Gate, setGate] = useState<any>(null);

  useEffect(() => {
    import("./SignupGateModal")
      .then((mod) => setGate(() => mod.default))
      .catch((err) => console.error("SignupGate load error:", err));
  }, []);

  if (!Gate) return null;
  return <Gate />;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavBar = !HIDE_NAVBAR_PATHS.some(p => pathname.startsWith(p));
  const skipGate = SKIP_GATE_PATHS.some(p => pathname.startsWith(p));

  // Check if user is authenticated — show signup gate if not
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    import("../../lib/supabase")
      .then(({ supabase }) => {
        supabase.auth.getUser().then(({ data }: any) => {
          setIsAuth(!!data?.user);
        });
        // Listen for auth changes (signup/login from the gate)
        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event: string, session: any) => {
            setIsAuth(!!session?.user);
          }
        );
        return () => listener?.subscription?.unsubscribe();
      })
      .catch(() => setIsAuth(false));
  }, []);

  // While checking auth, show nothing (prevents flash)
  const showGate = !skipGate && isAuth === false;

  return (
    <>
      {showNavBar && <NavBarLoader activePath={pathname} />}
      {children}
      {showGate && <SignupGateLoader />}
    </>
  );
}
