"use client";
import dynamic from "next/dynamic";

const NavBar = dynamic(() => import("../components/NavBar"), { ssr: false });
const MenaWatchMap = dynamic(() => import("../components/MenaWatchMap"), { ssr: false });

export default function MapPage() {
  return (
    <>
      <NavBar activePath="/map" />
      <MenaWatchMap />
    </>
  );
}
