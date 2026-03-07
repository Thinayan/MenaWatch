"use client";
import dynamic from "next/dynamic";

const NavBar = dynamic(() => import("../components/NavBar"), { ssr: false });
const OpsRoom = dynamic(() => import("../components/OpsRoom"), { ssr: false });

export default function OpsPage() {
  return (
    <>
      <NavBar activePath="/ops" />
      <OpsRoom />
    </>
  );
}
