"use client";
import dynamic from "next/dynamic";

const OpsContent = dynamic(() => import("./OpsContent"), { ssr: false });

export default function OpsPage() {
  return <OpsContent />;
}
