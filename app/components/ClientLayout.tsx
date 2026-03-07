"use client";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const NavBar = dynamic(() => import("./NavBar"), { ssr: false });

// Pages where NavBar should NOT appear
const HIDE_NAVBAR_PATHS = ["/login", "/reset-password", "/auth/callback"];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavBar = !HIDE_NAVBAR_PATHS.some(p => pathname.startsWith(p));

  return (
    <>
      {showNavBar && <NavBar activePath={pathname} />}
      {children}
    </>
  );
}
