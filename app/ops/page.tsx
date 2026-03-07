"use client";
import dynamic from "next/dynamic";

const OpsRoom = dynamic(() => import("../components/OpsRoom"), { ssr: false });

export default function OpsPage() {
  return <OpsRoom />;
}
