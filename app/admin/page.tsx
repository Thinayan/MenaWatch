"use client";
import dynamic from "next/dynamic";
import AuthGuard from "../components/AuthGuard";

const AdminDashboard = dynamic(() => import("../components/AdminDashboard"), { ssr: false });

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminDashboard />
    </AuthGuard>
  );
}
