"use client";
import dynamic from "next/dynamic";
import AuthGuard from "../components/AuthGuard";

const ProfilePage = dynamic(() => import("../components/ProfilePage"), { ssr: false });

export default function Profile() {
  return (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  );
}
