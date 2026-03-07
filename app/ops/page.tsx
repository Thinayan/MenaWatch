"use client";
import dynamic from "next/dynamic";
import AuthGuard from "../components/AuthGuard";

const OpsRoom = dynamic(() => import("../components/OpsRoom"), { ssr: false });

export default function OpsPage() {
  return (
    <AuthGuard>
      <OpsRoom />
    </AuthGuard>
  );
}
