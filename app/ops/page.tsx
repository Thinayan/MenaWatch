"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const OpsRoom = dynamic(() => import("../components/OpsRoom"), { ssr: false });

function NavBarWrapper() {
  const [NavBar, setNavBar] = useState<any>(null);

  useEffect(() => {
    import("../components/NavBar").then((mod) => {
      setNavBar(() => mod.default);
    });
  }, []);

  if (!NavBar) return null;
  return <NavBar activePath="/ops" />;
}

export default function OpsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBarWrapper />
      <OpsRoom />
    </div>
  );
}
