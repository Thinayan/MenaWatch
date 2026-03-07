"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MenaWatchMap = dynamic(() => import("../components/MenaWatchMap"), { ssr: false });

function NavBarWrapper() {
  const [NavBar, setNavBar] = useState<any>(null);

  useEffect(() => {
    import("../components/NavBar").then((mod) => {
      setNavBar(() => mod.default);
    });
  }, []);

  if (!NavBar) return null;
  return <NavBar activePath="/map" />;
}

export default function MapPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBarWrapper />
      <MenaWatchMap />
    </div>
  );
}
