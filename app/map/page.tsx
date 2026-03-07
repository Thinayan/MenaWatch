"use client";
import dynamic from "next/dynamic";

const MenaWatchMap = dynamic(() => import("../components/MenaWatchMap"), { ssr: false });

export default function MapPage() {
  return <MenaWatchMap />;
}
